terraform {
  required_version = ">= 1.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }

  # Uncomment and configure if you want to store state in a GCS bucket
  # backend "gcs" {
  #   bucket  = "YOUR_BUCKET_NAME"
  #   prefix  = "terraform/state"
  # }
}

provider "google" {
  project     = var.project_id
  region      = var.region
  zone        = var.zone
  credentials = file("sa-key.json")
}


provider "google-beta" {
  project     = var.project_id
  region      = var.region
  zone        = var.zone
  credentials = file("sa-key.json")
}

# Example Resource: Enable a critical API (Cloud Resource Manager)
# This is often needed for Terraform to do anything else.
resource "google_project_service" "crm_api" {
  project            = var.project_id
  service            = "cloudresourcemanager.googleapis.com"
  disable_on_destroy = false
}
