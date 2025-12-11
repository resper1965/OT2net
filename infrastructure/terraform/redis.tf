# Cloud Memorystore for Redis
resource "google_redis_instance" "cache" {
  name           = "ot2net-redis"
  tier           = "BASIC"
  memory_size_gb = 1

  region             = var.region
  authorized_network = google_compute_network.vpc.id

  depends_on = [google_service_networking_connection.private_vpc_connection]
}
