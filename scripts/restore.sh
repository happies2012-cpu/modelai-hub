#!/bin/bash
# Database restore script
# Restores from backup file with safety checks

set -euo pipefail

# Configuration
BACKUP_FILE="${1:-}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if backup file provided
if [ -z "$BACKUP_FILE" ]; then
    echo -e "${RED}Error: Backup file not specified${NC}"
    echo "Usage: $0 <backup_file>"
    echo "Available backups:"
    ls -lh "$BACKUP_DIR"/backup_*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

# Check if file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}Error: Backup file not found: ${BACKUP_FILE}${NC}"
    exit 1
fi

# Safety confirmation
echo -e "${YELLOW}WARNING: This will replace the current database!${NC}"
echo -e "${YELLOW}Backup file: ${BACKUP_FILE}${NC}"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${GREEN}Restore cancelled${NC}"
    exit 0
fi

echo -e "${GREEN}Starting database restore...${NC}"

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI not found${NC}"
    exit 1
fi

# Verify backup integrity
echo -e "${GREEN}Verifying backup integrity...${NC}"
if [[ "$BACKUP_FILE" == *.gz ]]; then
    if ! gunzip -t "$BACKUP_FILE" 2>/dev/null; then
        echo -e "${RED}Error: Backup file is corrupted!${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Backup integrity verified${NC}"
fi

# Create temporary restore file
TEMP_FILE=$(mktemp)
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo -e "${GREEN}Decompressing backup...${NC}"
    gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
else
    cp "$BACKUP_FILE" "$TEMP_FILE"
fi

# Restore database
echo -e "${GREEN}Restoring database...${NC}"
supabase db reset --db-url "$(supabase status | grep 'DB URL' | awk '{print $3}')" < "$TEMP_FILE" || {
    echo -e "${RED}Restore failed!${NC}"
    rm -f "$TEMP_FILE"
    exit 1
}

# Cleanup
rm -f "$TEMP_FILE"

echo -e "${GREEN}✓ Database restored successfully!${NC}"

