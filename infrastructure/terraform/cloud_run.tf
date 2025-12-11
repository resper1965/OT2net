# Cloud Run Service (Backend)
resource "google_cloud_run_v2_service" "backend" {
  name     = "ot2net-backend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"


  template {
    containers {
      image = "us-central1-docker.pkg.dev/ot2net/ot2net-repo/ot2net-backend:latest"
      
      env {
        name  = "DATABASE_URL"
        value = "postgresql://${google_sql_user.user.name}:${google_sql_user.user.password}@${google_sql_database_instance.instance.private_ip_address}/${google_sql_database.database.name}"
      }
    }
    
    # vpc_access {
    #   connector = google_vpc_access_connector.connector.id
    #   egress    = "PRIVATE_RANGES_ONLY"
    # }
  }

  depends_on = [google_project_service.apis]
}

# Cloud Run Service (Frontend)
resource "google_cloud_run_v2_service" "frontend" {
  name     = "ot2net-frontend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"


  template {
    containers {
      image = "us-central1-docker.pkg.dev/ot2net/ot2net-repo/ot2net-frontend:latest"
      
      env {
        name  = "NEXT_PUBLIC_API_URL"
        value = google_cloud_run_v2_service.backend.uri
      }
    }
  }

  depends_on = [google_project_service.apis]
}

# Domain Mapping
# Domain Mapping
resource "google_cloud_run_domain_mapping" "default" {
  location = var.region
  name     = "ot2net.ness.com.br"

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.frontend.name
  }
}
