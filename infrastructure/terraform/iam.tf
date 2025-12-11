# Allow public access to Frontend
resource "google_cloud_run_service_iam_member" "frontend_public" {
  location = google_cloud_run_v2_service.frontend.location
  service  = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Allow public access to Backend (required for client-side fetches)
resource "google_cloud_run_service_iam_member" "backend_public" {
  location = google_cloud_run_v2_service.backend.location
  service  = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
