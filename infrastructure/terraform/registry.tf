resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = "ot2net-repo"
  description   = "Docker repository for OT2net"
  format        = "DOCKER"

  depends_on = [google_project_service.apis]
}

output "repository_url" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.repo.name}"
}
