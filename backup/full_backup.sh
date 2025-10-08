#!/bin/bash

# === Configuration ===
PG_USER="postgres"
PG_PASSWORD="san@pos#25"
PG_HOST="localhost"
PG_PORT="5432"

BACKUP_DIR="/home/sankar/backups/postgres"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="${BACKUP_DIR}/all_databases_${DATE}.sql"

# === Ensure backup directory exists ===
mkdir -p "$BACKUP_DIR"

# === Export password for pg_dumpall ===
export PGPASSWORD="$PG_PASSWORD"

# === Perform the backup ===
echo "Starting full PostgreSQL cluster backup..."
pg_dumpall -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" -f "$BACKUP_FILE"

# === Compress backup ===
gzip "$BACKUP_FILE"
echo "Backup completed: ${BACKUP_FILE}.gz"

# === Retain only last 7 backups ===
find "$BACKUP_DIR" -name "all_databases_*.sql.gz" -mtime +7 -delete

# === Clean up ===
unset PGPASSWORD
