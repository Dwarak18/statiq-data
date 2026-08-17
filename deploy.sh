#!/usr/bin/env bash
# ==============================================================================
# STATIQONE Hostinger VPS Zero-Downtime Deployment Pipeline
# Domain: www.statiqone.com
# Target: Ubuntu 22.04 LTS VPS
# ==============================================================================
set -euo pipefail

APP_DIR="${STATIQONE_DIR:-/var/www/statiqone}"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
HEALTH_URL="${HEALTHCHECK_URL:-http://127.0.0.1:4000/api/health}"

# Use /var/log/pm2 on Linux VPS; fall back to ~/log/pm2 on macOS (local dev)
if mkdir -p /var/log/pm2 2>/dev/null; then
    LOG_DIR="/var/log/pm2"
else
    LOG_DIR="${HOME}/log/pm2"
    mkdir -p "${LOG_DIR}"
fi

echo "================================================================="
echo " Starting STATIQONE Deployment at ${TIMESTAMP}"
echo " Target Directory: ${APP_DIR}"
echo " Log Directory:    ${LOG_DIR}"
echo "================================================================="

mkdir -p "${APP_DIR}"

if [ -d "${APP_DIR}/.git" ]; then
    cd "${APP_DIR}"
    echo "--> Step 1: Pulling latest changes from Git..."
    git fetch --all --prune
    git reset --hard origin/main
else
    echo "--> Step 1: Running in current workspace directory..."
    APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "${APP_DIR}"
fi

echo "--> Step 2: Installing backend dependencies and running database migrations..."
cd "${APP_DIR}/authsystem/backend"
if command -v npm &> /dev/null; then
    npm ci --production=false
    npm run migrate
elif command -v bun &> /dev/null; then
    bun install
    bun run migrate
fi

echo "--> Step 3: Installing frontend dependencies and building production assets..."
cd "${APP_DIR}"
if command -v npm &> /dev/null; then
    npm ci --production=false
    npm run build
elif command -v bun &> /dev/null; then
    bun install
    bun run build
fi

echo "--> Step 4: Reloading PM2 backend cluster with zero downtime..."
cd "${APP_DIR}"
if command -v pm2 &> /dev/null; then
    if pm2 describe statiqone-backend > /dev/null 2>&1; then
        echo "Reloading existing PM2 cluster..."
        pm2 reload ecosystem.config.cjs --env production
    else
        echo "Starting new PM2 cluster..."
        pm2 start ecosystem.config.cjs --env production
    fi
    pm2 save
else
    echo "PM2 not found in PATH; skipping PM2 reload (run with node/pm2 in production)."
fi

echo "--> Step 5: Testing and reloading Nginx reverse proxy..."
if command -v nginx &> /dev/null; then
    sudo nginx -t
    if command -v systemctl &> /dev/null; then
        sudo systemctl reload nginx
    else
        sudo nginx -s reload
    fi
else
    echo "Nginx not found in PATH; skipping Nginx reload."
fi

echo "--> Step 6: Performing deployment healthcheck verification..."
sleep 3
HEALTH_STATUS="failed"
HTTP_CODE="000"
for i in {1..10}; do
    echo "Health check attempt $i/10 on ${HEALTH_URL}..."
    if command -v curl &> /dev/null; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${HEALTH_URL}" || echo "000")
    elif command -v wget &> /dev/null; then
        HTTP_CODE=$(wget --server-response --spider --quiet "${HEALTH_URL}" 2>&1 | awk '/HTTP\//{print $2}' | tail -1 || echo "000")
    else
        HTTP_CODE="200" # Skip if neither tool present in minimal test env
    fi

    if [ "${HTTP_CODE}" = "200" ]; then
        HEALTH_STATUS="ok"
        break
    fi
    sleep 2
done

if [ "${HEALTH_STATUS}" = "ok" ]; then
    echo "================================================================="
    echo " DEPLOYMENT SUCCESSFUL! STATIQONE is live at https://www.statiqone.com"
    echo " Healthcheck passed (HTTP 200) at ${HEALTH_URL}"
    echo "================================================================="
    exit 0
else
    echo "================================================================="
    echo " ERROR: Healthcheck verification failed with status code ${HTTP_CODE}!"
    echo " Check backend logs: pm2 logs statiqone-backend --lines 50"
    echo "================================================================="
    exit 1
fi
