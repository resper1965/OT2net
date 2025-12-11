# Infraestrutura OT2net - Terraform

Este diretório contém a configuração de Infraestrutura como Código (IaC) para o projeto OT2net usando Terraform no Google Cloud Platform (GCP).

## Pré-requisitos

1.  [Terraform](https://www.terraform.io/downloads.html) instalado.
2.  [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (`gcloud`) instalado e autenticado.
3.  Um projeto criado no Google Cloud.

## Configuração Inicial

1.  **Autentique-se no Google Cloud:**

    ```bash
    gcloud auth application-default login
    ```

2.  **Configure as variáveis:**
    Copie o arquivo de exemplo e edite com seus dados:

    ```bash
    cp terraform.tfvars.example terraform.tfvars
    ```

    Edite `terraform.tfvars` e insira o seu `project_id`.

3.  **Inicialize o Terraform:**

    ```bash
    terraform init
    ```

4.  **Verifique o plano de execução:**

    ```bash
    terraform plan
    ```

5.  **Aplique as mudanças:**
    ```bash
    terraform apply
    ```
