#/bin/bash

echo "Backing up global roles and privileges..."
pg_dumpall --globals-only -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" > "${BACKUP_DIR}/globals.sql"
gzip "${BACKUP_DIR}/globals.sql"
