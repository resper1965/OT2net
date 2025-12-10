#!/usr/bin/env python3
"""
Script para configurar variáveis de ambiente no Vercel via API
Projeto: ot-2net
"""

import os
import sys
import subprocess
import json
from typing import Optional

# Cores para output
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
RED = '\033[0;31m'
BLUE = '\033[0;34m'
NC = '\033[0m'  # No Color

# Valores conhecidos
SUPABASE_URL = "https://qaekhnagfzpwprvaxqwt.supabase.co"
NEXT_PUBLIC_SUPABASE_URL = "https://qaekhnagfzpwprvaxqwt.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY = "sb_publishable_hbperspgh1KUnMYUn_RmOA_VNrEspo7"

ENVIRONMENTS = ["production", "preview", "development"]


def run_vercel_command(cmd: list) -> tuple[bool, str]:
    """Executa comando Vercel CLI e retorna (sucesso, output)"""
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=False
        )
        return result.returncode == 0, result.stdout + result.stderr
    except Exception as e:
        return False, str(e)


def add_env_var(name: str, value: str, environment: str) -> bool:
    """Adiciona variável de ambiente via Vercel CLI"""
    print(f"  {BLUE}→{NC} Adicionando {name} ({environment})...")
    
    # Usar echo para passar o valor
    cmd = ["vercel", "env", "add", name, environment]
    
    # Executar com input do valor
    try:
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = process.communicate(input=value + "\n")
        
        if process.returncode == 0:
            print(f"  {GREEN}✓{NC} {name} ({environment}) configurada")
            return True
        else:
            # Verificar se já existe
            if "already exists" in stderr.lower() or "already exists" in stdout.lower():
                print(f"  {YELLOW}⚠{NC} {name} ({environment}) já existe, pulando...")
                return True
            print(f"  {RED}✗{NC} Erro ao configurar {name} ({environment}): {stderr}")
            return False
    except Exception as e:
        print(f"  {RED}✗{NC} Erro: {e}")
        return False


def check_vercel_login() -> bool:
    """Verifica se está logado no Vercel"""
    success, output = run_vercel_command(["vercel", "whoami"])
    if success:
        username = output.strip()
        print(f"{GREEN}✅{NC} Logado no Vercel como: {username}")
        return True
    else:
        print(f"{RED}❌{NC} Não está logado no Vercel")
        print(f"   Execute: {YELLOW}vercel login{NC}")
        return False


def main():
    print(f"{GREEN}🔧 Configurando Variáveis de Ambiente no Vercel{NC}\n")
    
    # Verificar login
    if not check_vercel_login():
        sys.exit(1)
    
    print()
    
    # Solicitar variáveis sensíveis
    print(f"{YELLOW}📝 Variáveis que precisam ser fornecidas:{NC}\n")
    
    # DATABASE_URL
    print(f"{YELLOW}1. DATABASE_URL{NC}")
    print("   Obter em: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/database")
    print("   Modo: Transaction (porta 6543)")
    database_url = input("   Digite a DATABASE_URL: ").strip()
    
    if not database_url:
        print(f"{RED}❌ DATABASE_URL é obrigatória{NC}")
        sys.exit(1)
    
    # SUPABASE_SERVICE_ROLE_KEY
    print()
    print(f"{YELLOW}2. SUPABASE_SERVICE_ROLE_KEY{NC}")
    print("   Obter em: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/api")
    print("   Seção: Project API keys > service_role (secret)")
    service_role_key = input("   Digite a SUPABASE_SERVICE_ROLE_KEY: ").strip()
    
    if not service_role_key:
        print(f"{RED}❌ SUPABASE_SERVICE_ROLE_KEY é obrigatória{NC}")
        sys.exit(1)
    
    print()
    print(f"{GREEN}🚀 Configurando variáveis...{NC}\n")
    
    # Variáveis públicas
    print(f"{GREEN}📋 Variáveis públicas (NEXT_PUBLIC_*):{NC}")
    public_vars = {
        "NEXT_PUBLIC_SUPABASE_URL": NEXT_PUBLIC_SUPABASE_URL,
        "NEXT_PUBLIC_SUPABASE_ANON_KEY": NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }
    
    for name, value in public_vars.items():
        for env in ENVIRONMENTS:
            add_env_var(name, value, env)
        print()
    
    # Variáveis privadas
    print(f"{GREEN}🔐 Variáveis privadas (Secret):{NC}")
    private_vars = {
        "SUPABASE_URL": SUPABASE_URL,
        "SUPABASE_SERVICE_ROLE_KEY": service_role_key,
        "DATABASE_URL": database_url,
    }
    
    for name, value in private_vars.items():
        for env in ENVIRONMENTS:
            add_env_var(name, value, env)
        print()
    
    print(f"{GREEN}✅ Configuração concluída!{NC}\n")
    print(f"{YELLOW}⚠️  IMPORTANTE: Faça um redeploy para aplicar as mudanças!{NC}")
    print()
    print("Opções para redeploy:")
    print("  1. Via Dashboard: Deployments > ... > Redeploy")
    print("  2. Via CLI: vercel --prod")
    print("  3. Via Git: git commit --allow-empty -m 'Trigger redeploy' && git push")
    print()


if __name__ == "__main__":
    main()

