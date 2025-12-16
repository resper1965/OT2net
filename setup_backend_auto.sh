#!/bin/bash
set -e

# Configuration
SERVICE_NAME="ot2net-backend"
REGION="us-central1"
INSTANCE_CONNECTION_NAME="ot2net:us-central1:ot2net-postgres"
DB_USER="ot2net_user"
DB_PASS="changeme123"
FRONTEND_URL="https://ot2net.ness.com.br"

# Path to Firebase key found in repo
FIREBASE_KEY_PATH="infrastructure/terraform/sa-key.json"

if [ ! -f "$FIREBASE_KEY_PATH" ]; then
    echo "Error: Firebase key not found at $FIREBASE_KEY_PATH"
    exit 1
fi

# Construct Database URL
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost/postgres?host=/cloudsql/${INSTANCE_CONNECTION_NAME}"

# Read Firebase JSON and compact it (remove newlines)
FIREBASE_SA=$(cat $FIREBASE_KEY_PATH | tr -d '\n')

echo "=== OT2net Backend Setup (Auto) ==="
echo "Configuring ${SERVICE_NAME}..."

# Update Cloud Run using individual flags, but be careful with JSON
# We will use --update-env-vars to avoid overwriting others if any, 
# but here we want to ensure these specific ones are set.

# To handle JSON in gcloud safely, we can output to a file source
cat > env_vars.yaml <<EOF
DATABASE_URL: "${DATABASE_URL}"
FRONTEND_URL: "${FRONTEND_URL}"
NODE_ENV: "production"
FIREBASE_SERVICE_ACCOUNT: '${FIREBASE_SA}'
EOF

gcloud run services update ${SERVICE_NAME} \
  --region=${REGION} \
  --add-cloudsql-instances=${INSTANCE_CONNECTION_NAME} \
  --env-vars-file=env_vars.yaml

echo ""
echo "✅ Backend configured successfully!"
rm env_vars.yaml
