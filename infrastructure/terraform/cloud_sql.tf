# Cloud SQL Instance
resource "google_sql_database_instance" "instance" {
  name             = "ot2net-postgres"
  region           = var.region
  database_version = "POSTGRES_15"

  depends_on = [google_service_networking_connection.private_vpc_connection]

  settings {
    tier = "db-f1-micro" # Smallest for dev/testing
    
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.vpc.id
    }
  }

  deletion_protection = false # Set to true for production!
}

# Database
resource "google_sql_database" "database" {
  name     = "ot2net_db"
  instance = google_sql_database_instance.instance.name
}

# User
resource "google_sql_user" "user" {
  name     = "ot2net_user"
  instance = google_sql_database_instance.instance.name
  password = "changeme123" # TODO: Use Secret Manager
}
