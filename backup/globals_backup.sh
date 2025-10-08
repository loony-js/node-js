#!/bin/bash

# =======================
# Configuration
# =======================
PG_USER="postgres"
PG_HOST="localhost"
PG_PORT="5432"
BACKUP_BASE_DIR="/var/backups/postgres"
CONFIG_DIR="/etc/postgresql/14/main"  # Change to your PostgreSQL config directory
KEEP_DAYS=7                             # How long to keep old backups

# =======================
# Ask for PostgreSQL password
# =======================
read -s -p "Enter PostgreSQL password for user $PG_USER: " PG_PASSWORD
echo

# =======================
# Prepare backup folder
# =======================
DATE=$(date +"%Y-%m-%d")
BACKUP_DIR="${BACKUP_BASE_DIR}/${DATE}"
mkdir -p "$BACKUP_DIR"

# =======================
# Export password for commands
# =======================
export PGPASSWORD="$PG_PASSWORD"

# =======================
# Backup all non-template databases
# =======================
DB_LIST=$(psql -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" -t -c \
"SELECT datname FROM pg_database WHERE datistemplate = false;")

for DB in $DB_LIST; do
    echo "Backing up database: $DB"
    BACKUP_FILE="${BACKUP_DIR}/${DB}.sql"
    pg_dump -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" -F p -b -v -f "$BACKUP_FILE" "$DB"
    gzip "$BACKUP_FILE"
done

# =======================
# Backup global roles and privileges
# =======================
echo "Backing up global roles and privileges..."
pg_dumpall -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" --globals-only > "${BACKUP_DIR}/globals.sql"
gzip "${BACKUP_DIR}/globals.sql"

# =======================
# Backup PostgreSQL configuration files
# =======================
echo "Backing up PostgreSQL configuration files..."
mkdir -p "${BACKUP_DIR}/config"
cp "$CONFIG_DIR/postgresql.conf" "$CONFIG_DIR/pg_hba.conf" "${BACKUP_DIR}/config/"

# =======================
# Cleanup old backups
# =======================
find "$BACKUP_BASE_DIR" -maxdepth 1 -type d -mtime +$KEEP_DAYS -exec rm -rf {} \;

# =======================
# Unset password
# =======================
unset PGPASSWORD

echo "✅ Full PostgreSQL backup completed: $BACKUP_DIR"
