output "project_id" {
  description = "The Project ID being used"
  value       = var.project_id
}

output "region" {
  description = "The region being used"
  value       = var.region
}

# Database
output "db_instance_address" {
  description = "The private IP address of the SQL instance"
  value       = google_sql_database_instance.instance.private_ip_address
}

output "db_connection_name" {
  description = "The connection name of the SQL instance"
  value       = google_sql_database_instance.instance.connection_name
}

# Redis
output "redis_host" {
  description = "The IP address of the Redis instance"
  value       = google_redis_instance.cache.host
}

# Cloud Run
output "backend_url" {
  description = "URL of the backend service"
  value       = google_cloud_run_v2_service.backend.uri
}

output "frontend_url" {
  description = "URL of the frontend service"
  value       = google_cloud_run_v2_service.frontend.uri
}

# output "domain_dns_records" {
#   description = "DNS records for the custom domain"
#   value       = google_cloud_run_domain_mapping.default.status[0].resource_records
# }
