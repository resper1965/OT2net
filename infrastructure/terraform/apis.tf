# Enable APIs
resource "google_project_service" "apis" {
  for_each = toset([
    "cloudresourcemanager.googleapis.com",
    "compute.googleapis.com",
    "servicenetworking.googleapis.com",
    "firebase.googleapis.com",
    "identitytoolkit.googleapis.com",
    "aiplatform.googleapis.com",
    "sqladmin.googleapis.com",
    "run.googleapis.com",
    "redis.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "vpcaccess.googleapis.com"
  ])

  project            = var.project_id
  service            = each.key
  disable_on_destroy = false
}
