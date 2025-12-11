# VPC
resource "google_compute_network" "vpc" {
  name                    = "ot2net-vpc"
  auto_create_subnetworks = false
  depends_on              = [google_project_service.apis]
}

# Subnet
resource "google_compute_subnetwork" "subnet" {
  name          = "ot2net-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.vpc.id
}

# Serverless VPC Connector (for Cloud Run to access SQL/Redis)
resource "google_vpc_access_connector" "connector" {
  name          = "ot2net-connector"
  region        = var.region
  network       = google_compute_network.vpc.name
  ip_cidr_range = "10.8.0.0/28"
  depends_on    = [google_project_service.apis]
}

# Private Service Access (for Cloud SQL / Redis)
resource "google_compute_global_address" "private_ip_address" {
  name          = "private-ip-address"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}
