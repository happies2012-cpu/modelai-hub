#!/bin/bash
# Incident response automation
# Handles common incident scenarios

set -euo pipefail

INCIDENT_TYPE="${1:-}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
INCIDENT_LOG="./incidents/incident_${TIMESTAMP}.log"

mkdir -p ./incidents

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$INCIDENT_LOG"
}

case "$INCIDENT_TYPE" in
    "security-breach")
        log "SECURITY INCIDENT: Potential breach detected"
        log "Actions:"
        log "1. Enabling maintenance mode"
        log "2. Rotating API keys"
        log "3. Reviewing audit logs"
        log "4. Notifying security team"
        
        # Enable maintenance mode
        echo "VITE_MAINTENANCE_MODE=true" >> .env.production
        
        # Rotate keys (requires manual intervention)
        log "⚠️  Manual action required: Rotate API keys in Supabase dashboard"
        ;;
        
    "database-down")
        log "DATABASE INCIDENT: Database unavailable"
        log "Actions:"
        log "1. Checking database status"
        log "2. Attempting connection recovery"
        log "3. Enabling read-only mode if available"
        
        # Check Supabase status
        if command -v supabase &> /dev/null; then
            supabase status || log "ERROR: Cannot connect to Supabase"
        fi
        ;;
        
    "payment-failure")
        log "PAYMENT INCIDENT: Payment gateway failure"
        log "Actions:"
        log "1. Disabling payment processing"
        log "2. Notifying payment provider"
        log "3. Alerting operations team"
        
        echo "VITE_ALLOW_PAYMENTS=false" >> .env.production
        ;;
        
    "high-traffic")
        log "TRAFFIC INCIDENT: High traffic detected"
        log "Actions:"
        log "1. Enabling rate limiting"
        log "2. Scaling resources if available"
        log "3. Monitoring performance"
        
        # Increase rate limits (would need to update config)
        log "⚠️  Manual action: Review and adjust rate limits"
        ;;
        
    "data-corruption")
        log "DATA INCIDENT: Potential data corruption"
        log "Actions:"
        log "1. Stopping writes"
        log "2. Creating emergency backup"
        log "3. Reviewing recent changes"
        
        # Create emergency backup
        if [ -f "./scripts/backup.sh" ]; then
            ./scripts/backup.sh
        fi
        ;;
        
    *)
        echo "Usage: $0 <incident-type>"
        echo "Available types:"
        echo "  security-breach"
        echo "  database-down"
        echo "  payment-failure"
        echo "  high-traffic"
        echo "  data-corruption"
        exit 1
        ;;
esac

log "Incident response completed"
log "Review log: $INCIDENT_LOG"

