# 📐 Arquitetura da Solução

Esta seção detalha os componentes de hardware e software e o design da rede.

## 1. Pilha de Tecnologia (Stack)

* **Hypervisor (Host):** Proxmox VE
* **Firewall (VM 1):** pfSense
* **Gateway (VM 2):** Ubuntu Server rodando Kasm Workspaces (Docker)

## 2. Requisitos de Hardware (Mínimo para 10 Usuários)

* **CPU:** 8+ Cores (AMD EPYC, Intel Xeon)
* **RAM:** 32 GB DDR4
* **Storage:** 1 TB NVMe SSD (para I/O rápido dos contêineres)
* **Rede:** 4 Placas de Rede (NICs) Físicas

## 3. Design da Rede

### Interfaces Físicas (Proxmox)

| Interface | Propósito | Conectado a |
| :--- | :--- | :--- |
| `eno1` | Gerência (Proxmox) | Switch de Gerência |
| `eno2` | WAN (Internet) | Roteador/Modem |
| `eno3` | Rede OT | Switch da Rede OT |
| `eno4` | Rede IT (Corp) | Switch da Rede Corp |

### Redes Virtuais (Proxmox Bridges)

| Bridge | IPs (Exemplo) | VMs Conectadas |
| :--- | :--- | :--- |
| `vmbr0` (WAN) | DHCP (Público) | `pfSense` (WAN) |
| `vmbr1` (OT) | 10.10.1.0/24 | `pfSense` (OT) |
| `vmbr2` (IT) | 192.168.1.0/24 | `pfSense` (IT) |
| `vmbr3` (DMZ) | 192.168.100.0/24 | `pfSense` (DMZ), `Kasm` |

## 4. Matriz de Regras do Firewall (pfSense)

| De (Origem) | Para (Destino) | Porta | Ação | Propósito |
| :--- | :--- | :--- | :--- | :--- |
| **OT** | **DMZ** (IP Kasm) | 443 | **PERMITIR** | Acesso ao portal Kasm |
| **OT** | **QUALQUER** | Todas | **NEGAR** | Isola a rede OT |
| **DMZ** | **OT** | Todas | **NEGAR** | Impede ataque da DMZ |
| **DMZ** | **IT** (AD) | 389/636 | **PERMITIR** | Autenticação (Opcional) |
| **DMZ** | **WAN** | 80, 443 | **PERMITIR** | Navegação dos contêineres |
| **IT** | **DMZ** (IP Kasm) | 443 | **PERMITIR** | Acesso (opcional) |
