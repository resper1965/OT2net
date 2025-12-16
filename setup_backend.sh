#!/bin/bash
set -e

# Configuration
SERVICE_NAME="ot2net-backend"
REGION="us-central1"
INSTANCE_CONNECTION_NAME="ot2net:us-central1:ot2net-postgres"
DB_USER="postgres"
FRONTEND_URL="https://ot2net.ness.com.br"

echo "=== OT2net Backend Setup ==="
echo "We need to configure the backend with production credentials."
echo ""

# 1. Database Password
read -s -p "Enter Cloud SQL Password for 'postgres': " DB_PASS
echo ""
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost/postgres?host=/cloudsql/${INSTANCE_CONNECTION_NAME}"

# 2. Firebase Service Account
echo ""
echo "Paste the content of your Firebase Service Account JSON file."
echo "Press Ctrl+D when finished:"
FIREBASE_SA=$(cat)

# 3. Update Cloud Run
echo ""
echo "Updating Cloud Run service '${SERVICE_NAME}'..."

gcloud run services update ${SERVICE_NAME} \
  --region=${REGION} \
  --add-cloudsql-instances=${INSTANCE_CONNECTION_NAME} \
  --set-env-vars="DATABASE_URL=${DATABASE_URL}" \
  --set-env-vars="FIREBASE_SERVICE_ACCOUNT=${FIREBASE_SA}" \
  --set-env-vars="FRONTEND_URL=${FRONTEND_URL}" \
  --set-env-vars="NODE_ENV=production"

echo ""
echo "✅ Backend configured successfully!"
echo "Please wait a moment for the new revision to spin up."
