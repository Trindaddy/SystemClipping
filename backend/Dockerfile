# Versão exata solicitada
FROM python:3.14-slim

WORKDIR /app

# Evita arquivos .pyc e buffer de log
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instala dependências do SO necessárias para compilar pacotes Python
# (Essencial para Python 3.14 onde wheels binárias podem faltar)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instala dependências do Python
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copia o código
COPY . .

# Comando padrão (será sobrescrito pelo docker-compose, mas bom ter aqui)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]