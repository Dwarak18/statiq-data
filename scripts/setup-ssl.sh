#!/usr/bin/env bash
# ==============================================================================
# STATIQONE Let's Encrypt SSL Provisioning Script for Hostinger VPS
# Domain: www.statiqone.com & statiqone.com
# ==============================================================================
set -euo pipefail

DOMAIN="statiqone.com"
WWW_DOMAIN="www.statiqone.com"
EMAIL="admin@statiqone.com"
ACME_DIR="/var/www/certbot"

echo "================================================================="
echo " Setting up Let's Encrypt SSL for ${WWW_DOMAIN} and ${DOMAIN}"
echo "================================================================="

# Create ACME challenge directory
mkdir -p "${ACME_DIR}"

# Check and install Certbot if not available
if ! command -v certbot &> /dev/null; then
    echo "--> Installing Certbot and Nginx plugin..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update -y
        sudo apt-get install -y certbot python3-certbot-nginx
    elif command -v yum &> /dev/null; then
        sudo yum install -y epel-release certbot python3-certbot-nginx
    else
        echo "Error: Package manager not supported. Please install certbot manually."
        exit 1
    fi
fi

echo "--> Requesting SSL certificates from Let's Encrypt..."
sudo certbot certonly --nginx \
    -d "${DOMAIN}" \
    -d "${WWW_DOMAIN}" \
    --non-interactive \
    --agree-tos \
    -m "${EMAIL}" \
    --keep-until-expiring \
    --preferred-challenges http

echo "--> Testing automatic certificate renewal..."
sudo certbot renew --dry-run

echo "--> Reloading Nginx to apply certificates..."
if command -v systemctl &> /dev/null; then
    sudo systemctl reload nginx || sudo nginx -s reload
fi

echo "================================================================="
echo " SSL Certificates successfully configured and verified!"
echo " Domain: https://${WWW_DOMAIN}"
echo "================================================================="
