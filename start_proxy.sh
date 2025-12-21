#!/bin/bash
# Start Cloud SQL Proxy for ot2net using Service Account Key
./cloud-sql-proxy --credentials-file=gcp-key.json ot2net:us-central1:ot2net-postgres
