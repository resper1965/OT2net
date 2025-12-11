variable "project_id" {
  description = "The ID of the Google Cloud Project"
  type        = string
}

variable "region" {
  description = "The default GCP region for resources"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "The default GCP zone for resources"
  type        = string
  default     = "us-central1-a"
}
