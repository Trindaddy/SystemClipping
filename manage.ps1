param (
    [string]$Command
)

$ErrorActionPreference = "Stop"

function Run-Docker {
    param ([string]$Arguments)
    Write-Host "Executando: docker compose $Arguments" -ForegroundColor Gray
    & docker compose $Arguments.Split(" ")
}

switch ($Command) {
    "up" { 
        Write-Host "--- Subindo ambiente ---" -ForegroundColor Green
        Run-Docker "up -d" 
    }
    "down" { 
        Write-Host "--- Parando ambiente ---" -ForegroundColor Yellow
        Run-Docker "down" 
    }
    "build" { 
        Write-Host "--- Construindo ---" -ForegroundColor Cyan
        Run-Docker "build" 
    }
    "logs" { 
        Run-Docker "logs -f" 
    }
    "api-shell" { 
        # ESTE É O COMANDO QUE FALTOU
        Write-Host "--- Entrando no Django ---" -ForegroundColor Green
        Run-Docker "exec api bash" 
    }
    "web-shell" { 
        Write-Host "--- Entrando no React ---" -ForegroundColor Green
        Run-Docker "exec web sh" 
    }
    "init-project" {
        Write-Host "--- INICIALIZANDO PROJETO ---" -ForegroundColor Green
        Run-Docker "build"
        Write-Host "1. Criando Backend..."
        Run-Docker "run --rm api django-admin startproject core ."
        Write-Host "2. Criando Frontend..."
        Run-Docker "run --rm web npm create vite@latest . -- --template react"
        Write-Host "3. Instalando dependências..."
        Run-Docker "run --rm web npm install"
        Write-Host "PRONTO! Rode: .\manage.ps1 up" -ForegroundColor Green
    }
    Default {
        Write-Host "Comando não reconhecido." -ForegroundColor Red
        Write-Host "Use: up, down, build, logs, api-shell, init-project"
    }
}