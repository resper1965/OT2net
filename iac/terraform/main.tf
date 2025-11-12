locals {
  pfSense_name = "secure-ot-browser-pfsense"
  kasm_name    = "secure-ot-browser-kasm"
}

resource "proxmox_vm_qemu" "pfsense" {
  name        = local.pfSense_name
  target_node = var.proxmox_target_node
  clone       = var.pfsense_template
  full_clone  = true

  cores   = 2
  sockets = 1
  memory  = 4096
  scsihw  = "virtio-scsi-single"

  disks {
    scsi0 = "local-lvm:${var.pfsense_disk_size_gb}"
  }

  network {
    id     = 0
    model  = "virtio"
    bridge = var.bridge_wan
  }

  network {
    id     = 1
    model  = "virtio"
    bridge = var.bridge_ot
  }

  network {
    id     = 2
    model  = "virtio"
    bridge = var.bridge_it
  }

  network {
    id     = 3
    model  = "virtio"
    bridge = var.bridge_dmz
  }

  lifecycle {
    ignore_changes = [network]
  }
}

resource "proxmox_vm_qemu" "kasm" {
  name        = local.kasm_name
  target_node = var.proxmox_target_node
  clone       = var.kasm_template
  full_clone  = true

  cores   = 6
  sockets = 1
  memory  = 16384
  scsihw  = "virtio-scsi-single"

  disks {
    scsi0 = "local-lvm:${var.kasm_disk_size_gb}"
  }

  network {
    id     = 0
    model  = "virtio"
    bridge = var.bridge_dmz
  }

  depends_on = [proxmox_vm_qemu.pfsense]
}
