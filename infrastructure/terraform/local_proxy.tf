resource "google_service_account" "local_proxy" {
  account_id   = "ot2net-local-proxy"
  display_name = "Local Dev Proxy (Created via Terraform)"
  description  = "Service account for local development Cloud SQL Proxy access"
}

resource "google_project_iam_member" "local_proxy_sql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.local_proxy.email}"
}
