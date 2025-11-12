variable "proxmox_api_url" {
  description = "Endpoint da API do Proxmox, ex: https://proxmox.local:8006/api2/json"
  type        = string
}

variable "proxmox_api_user" {
  description = "Usuário com permissões para criar VMs (formato user@realm)"
  type        = string
}

variable "proxmox_api_password" {
  description = "Senha ou token secreto do usuário do Proxmox"
  type        = string
  sensitive   = true
}

variable "proxmox_api_skip_tls_verify" {
  description = "Ignora validação TLS (usar apenas em labs)"
  type        = bool
  default     = false
}

variable "proxmox_target_node" {
  description = "Nome do nó Proxmox que receberá as VMs"
  type        = string
}

variable "proxmox_storage_pool" {
  description = "Pool de storage onde os discos das VMs serão alocados"
  type        = string
  default     = "local-lvm"
}

variable "pfsense_template" {
  description = "Nome do template/VM base do pfSense para clonagem"
  type        = string
}

variable "kasm_template" {
  description = "Nome do template/VM base do Ubuntu Kasm para clonagem"
  type        = string
}

variable "pfsense_disk_size_gb" {
  description = "Tamanho do disco virtual do pfSense em GB"
  type        = number
  default     = 20
}

variable "kasm_disk_size_gb" {
  description = "Tamanho do disco virtual do Kasm em GB"
  type        = number
  default     = 200
}

variable "bridge_wan" {
  description = "Bridge Proxmox conectada à WAN"
  type        = string
  default     = "vmbr0"
}

variable "bridge_ot" {
  description = "Bridge Proxmox conectada à rede OT"
  type        = string
  default     = "vmbr1"
}

variable "bridge_it" {
  description = "Bridge Proxmox conectada à rede IT"
  type        = string
  default     = "vmbr2"
}

variable "bridge_dmz" {
  description = "Bridge Proxmox conectada à DMZ"
  type        = string
  default     = "vmbr3"
}
