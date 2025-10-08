#!/bin/bash

# === Configuration ===
PG_USER="postgres"
PG_HOST="localhost"
PG_PORT="5432"
BACKUP_DIR="$HOME/backups/postgres"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")

# === Ask for password securely ===
read -s -p "Enter PostgreSQL password for user $PG_USER: " PG_PASSWORD
echo

# === Ensure backup directory exists ===
mkdir -p "$BACKUP_DIR"

# === Export password temporarily ===
export PGPASSWORD="$PG_PASSWORD"

# === Get all non-template databases ===
DB_LIST=$(psql -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" -t -c \
"SELECT datname FROM pg_database WHERE datistemplate = false;")

# === Loop through and back up each database ===
for DB in $DB_LIST; do
    echo "Backing up database: $DB"
    BACKUP_FILE="${BACKUP_DIR}/${DB}_${DATE}.backup"
    pg_dump -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" -F c -b -v -f "$BACKUP_FILE" "$DB"
    gzip "$BACKUP_FILE"
done

# === Optionally back up global roles and privileges ===
echo "Backing up global roles and privileges..."
pg_dumpall -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" --globals-only > "${BACKUP_DIR}/globals_${DATE}.sql"
gzip "${BACKUP_DIR}/globals_${DATE}.sql"

# === Clean old backups (older than 7 days) ===
find "$BACKUP_DIR" -name "*.backup.gz" -mtime +7 -delete
find "$BACKUP_DIR" -name "globals_*.sql.gz" -mtime +7 -delete

# === Unset password for security ===
unset PGPASSWORD

echo "✅ All PostgreSQL databases and roles backed up successfully!"
