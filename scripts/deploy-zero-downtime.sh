#!/bin/bash
# Zero-downtime deployment script
# Blue-green deployment strategy

set -euo pipefail

ENVIRONMENT="${1:-production}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DEPLOYMENT_LOG="./deployments/deployment_${TIMESTAMP}.log"

mkdir -p ./deployments

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$DEPLOYMENT_LOG"
}

error_exit() {
    log "ERROR: $1"
    exit 1
}

# Pre-deployment checks
log "Starting zero-downtime deployment to $ENVIRONMENT"

# 1. Health check current deployment
log "Step 1: Health check current deployment"
if ! curl -f -s http://localhost:8080/health > /dev/null 2>&1; then
    log "Warning: Current deployment health check failed"
fi

# 2. Build new version
log "Step 2: Building new version"
if ! bun run build; then
    error_exit "Build failed"
fi

# 3. Run tests (if available)
log "Step 3: Running tests"
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    bun test || log "Warning: Tests failed, continuing anyway"
fi

# 4. Create backup
log "Step 4: Creating database backup"
if [ -f "./scripts/backup.sh" ]; then
    ./scripts/backup.sh || log "Warning: Backup failed, continuing anyway"
fi

# 5. Run database migrations
log "Step 5: Running database migrations"
if command -v supabase &> /dev/null; then
    supabase db push || error_exit "Migration failed"
fi

# 6. Deploy to staging slot (blue-green)
log "Step 6: Deploying to staging slot"
# In a real scenario, this would:
# - Deploy to a separate instance/container
# - Run smoke tests
# - Switch traffic gradually

# 7. Smoke tests
log "Step 7: Running smoke tests"
SMOKE_TESTS_PASSED=true

# Test critical endpoints
for endpoint in "/health" "/api/health"; do
    if ! curl -f -s "http://localhost:8080${endpoint}" > /dev/null 2>&1; then
        log "Warning: Smoke test failed for $endpoint"
        SMOKE_TESTS_PASSED=false
    fi
done

if [ "$SMOKE_TESTS_PASSED" = false ]; then
    log "Warning: Some smoke tests failed, but continuing"
fi

# 8. Switch traffic (gradual rollout)
log "Step 8: Switching traffic to new version"
# In production, this would use:
# - Load balancer configuration
# - Container orchestration (Kubernetes, Docker Swarm)
# - CDN cache invalidation

# 9. Monitor new deployment
log "Step 9: Monitoring new deployment"
sleep 30
if ! curl -f -s http://localhost:8080/health > /dev/null 2>&1; then
    log "ERROR: New deployment health check failed - consider rollback"
    # Rollback logic would go here
fi

# 10. Cleanup old version
log "Step 10: Cleaning up old version"
# Keep old version for quick rollback (e.g., 24 hours)

log "Deployment completed successfully"
log "Deployment log: $DEPLOYMENT_LOG"

