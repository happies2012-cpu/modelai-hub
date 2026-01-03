#!/bin/bash
# Database backup script
# Creates timestamped backups with retention policy

set -euo pipefail

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo -e "${GREEN}Starting database backup...${NC}"

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI not found. Install with: npm install -g supabase${NC}"
    exit 1
fi

# Check if linked to project
if ! supabase status &> /dev/null; then
    echo -e "${YELLOW}Warning: Not linked to Supabase project. Attempting to link...${NC}"
    if [ -z "${SUPABASE_PROJECT_REF:-}" ]; then
        echo -e "${RED}Error: SUPABASE_PROJECT_REF not set${NC}"
        exit 1
    fi
    supabase link --project-ref "$SUPABASE_PROJECT_REF"
fi

# Create backup
echo -e "${GREEN}Creating backup: ${BACKUP_FILE}${NC}"
supabase db dump -f "$BACKUP_FILE" || {
    echo -e "${RED}Backup failed!${NC}"
    exit 1
}

# Compress backup
echo -e "${GREEN}Compressing backup...${NC}"
gzip -f "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo -e "${GREEN}Backup created: ${BACKUP_FILE} (${BACKUP_SIZE})${NC}"

# Cleanup old backups
echo -e "${GREEN}Cleaning up backups older than ${RETENTION_DAYS} days...${NC}"
find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete

# List remaining backups
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f | wc -l)
echo -e "${GREEN}Total backups: ${BACKUP_COUNT}${NC}"

# Verify backup integrity
echo -e "${GREEN}Verifying backup integrity...${NC}"
if gunzip -t "$BACKUP_FILE" 2>/dev/null; then
    echo -e "${GREEN}✓ Backup integrity verified${NC}"
else
    echo -e "${RED}✗ Backup integrity check failed!${NC}"
    exit 1
fi

echo -e "${GREEN}Backup completed successfully!${NC}"

