# ⚙️ Operações e Manutenção

## 1. Backup (Plano A)

1. Use um **Proxmox Backup Server (PBS)** ou um **NAS (NFS/CIFS)**.
2. No Proxmox, vá em `Datacenter -> Storage` e adicione seu storage de backup.
3. Vá em `Datacenter -> Backup` e crie um job agendado.
4. **IMPORTANTE:** Faça backup de **AMBAS** as VMs (`pfSense` e `Kasm`) diariamente.

## 2. Recuperação de Desastre (Plano A - Restore)

1. Instale o Proxmox VE no novo hardware.
2. Adicione o storage de backup (conforme passo 1.2).
3. No seu storage de backup, localize os backups das VMs.
4. Clique no backup da `pfSense` -> **Restore**.
5. Clique no backup da `Kasm` -> **Restore**.
6. Inicie as VMs. O sistema estará 100% operacional.

## 3. Reconstrução (Plano B - IaC)

Se os backups falharem, use o IaC para reconstruir do zero:

1. Instale o Proxmox e configure as redes em `/etc/network/interfaces`.
2. Clone este repositório.
3. Restaure o `config.xml` do pfSense (pode ser via Ansible).
4. Execute `terraform apply`.
5. Execute `ansible-playbook ...`.

## 4. Branding (Customização do Produto)

Para adicionar a marca da sua empresa:

1. Acesse o portal do Kasm como administrador.
2. Navegue até `Admin -> Branding`.
3. Faça o upload do seu **Logo**, **Favicon** e **Imagem de Fundo**.
4. (Opcional) Use a seção **Custom CSS** para alterar cores.
