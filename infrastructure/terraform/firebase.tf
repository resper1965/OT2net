# Enable Firebase Service on the project
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = var.project_id

  depends_on = [
    google_project_service.apis["firebase.googleapis.com"],
    google_project_service.apis["identitytoolkit.googleapis.com"]
  ]
}

# Create a Firebase Web App
resource "google_firebase_web_app" "default" {
  provider     = google-beta
  project      = var.project_id
  display_name = "OT2net Web App"

  depends_on = [google_firebase_project.default]
}

# Get the Web App config (API Key, App ID, etc.)
data "google_firebase_web_app_config" "default" {
  provider   = google-beta
  web_app_id = google_firebase_web_app.default.app_id
}

# Export the config variables needed for frontend build
output "firebase_config" {
  value = {
    api_key             = data.google_firebase_web_app_config.default.api_key
    auth_domain         = data.google_firebase_web_app_config.default.auth_domain
    project_id          = var.project_id
    storage_bucket      = lookup(data.google_firebase_web_app_config.default, "storage_bucket", "")
    messaging_sender_id = lookup(data.google_firebase_web_app_config.default, "messaging_sender_id", "")
    app_id              = google_firebase_web_app.default.app_id
  }
  sensitive = true
}
