# 📰 ClippingPro - Sistema de Monitoramento Híbrido

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![N8n](https://img.shields.io/badge/n8n-FF6D5A?style=for-the-badge&logo=n8n&logoColor=white)

> Um sistema full-stack para monitoramento de notícias e editais em tempo real, combinando varredura global (Google News) com monitoramento cirúrgico de fontes oficiais.

---

## 🚀 Sobre o Projeto

O **ClippingPro** resolve o problema de monitoramento manual de notícias. Diferente de agregadores comuns, ele utiliza uma **Arquitetura em Y** para:
1.  **Monitoramento Global:** Capta tendências usando RSS do Google News.
2.  **Monitoramento Oficial:** Capta dados diretamente de fontes confiáveis (CNN, G1, Portais de Prefeitura).
3.  **Merge Inteligente:** Unifica, etiqueta e armazena os dados para análise.

### ✨ Funcionalidades Principais

- [x] **Dashboard Moderno:** Interface em React + Vite com TailwindCSS.
- [x] **Automação Low-Code:** Fluxos gerenciados via n8n (fácil manutenção).
- [x] **Etiquetagem de Fonte:** Identificação visual da origem (ex: 🔵 Google vs 🔴 G1).
- [x] **Busca Instantânea:** Filtro em tempo real no Frontend.
- [ ] **IA de Sentimento:** Análise automática (Positivo/Negativo/Neutro) [Em breve].
- [ ] **Alertas:** Notificações via Telegram/Email [Em breve].

---

## 🛠️ Arquitetura do Projeto

O sistema roda 100% em containers Docker, garantindo isolamento e facilidade de deploy.

```bash
SystemClipping/
├── 📂 backend/          # API Django Rest Framework (Banco de Dados)
├── 📂 frontend/         # Dashboard React + Vite
├── 📂 n8n_data/         # Volumes do n8n (Persistência)
├── 📜 docker-compose.yml # Orquestrador dos containers
└── 📜 README.md         # Documentação

💻 Instalação e Execução
Pré-requisitos: Docker Desktop e Git.

1. Clone o repositório
git clone [https://github.com/Trindaddy/SystemClipping.git](https://github.com/Trindaddy/SystemClipping.git)
cd SystemClipping

2. Suba o ambiente
Este comando baixa as imagens, constrói o Frontend/Backend e inicia os serviços.
docker compose up -d --build

3. Migre o Banco de Dados (Apenas na 1ª vez)
docker compose exec api python manage.py migrate

🔗 Acessos
| Serviço             | URL                                                                      | Descrição                            |
| ------------------- | ------------------------------------------------------------------------ | ------------------------------------ |
| **Frontend**        | [http://localhost:5173](http://localhost:5173)                           | O Painel visual do usuário.          |
| **Automação (n8n)** | [http://localhost:5678](http://localhost:5678)                           | Onde os fluxos de busca são criados. |
| **API (Backend)**   | [http://localhost:8000/api/noticias](http://localhost:8000/api/noticias) | Endpoint de dados brutos.            |

⚙️ Configuração do N8n
Ao acessar o n8n pela primeira vez:

Crie seu usuário admin.

Importe o workflow do projeto (localizado na pasta /docs ou solicite ao administrador).

Ative o botão Active no canto superior direito para o robô começar a trabalhar.

Verifique se esse README está bem certinho e bonito
