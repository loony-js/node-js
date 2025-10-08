#!/bin/bash

# === Configuration ===
PG_USER="postgres"
PG_HOST="localhost"
PG_PORT="5432"
BACKUP_DIR="$HOME/backups/postgres"

# === Ask for password securely ===
read -s -p "Enter PostgreSQL password for user $PG_USER: " PG_PASSWORD
echo

# === Export password temporarily ===
export PGPASSWORD="$PG_PASSWORD"

# === Loop through all .backup.gz files ===
for BACKUP_FILE in "$BACKUP_DIR"/*.backup.gz; do
    # Skip if no files found
    [ -e "$BACKUP_FILE" ] || { echo "No backup files found in $BACKUP_DIR"; break; }

    # Extract database name from filename (strip directory and extension)
    DB_NAME=$(basename "$BACKUP_FILE" .backup.gz)

    echo "Restoring database: $DB_NAME from $BACKUP_FILE"

    # Create database if it doesn't exist
    if ! psql -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
        createdb -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" "$DB_NAME"
        echo "Database $DB_NAME created."
    fi

    # Restore the backup using gunzip to stream the file
    gunzip -c "$BACKUP_FILE" | pg_restore -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" -d "$DB_NAME" -v

    echo "✅ Database $DB_NAME restored successfully."
done

# === Clean up ===
unset PGPASSWORD
echo "All backups restored!"
