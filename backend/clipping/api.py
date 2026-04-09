from ninja import NinjaAPI, Schema
from typing import List
from datetime import datetime
from .models import Noticia, Assinante  # <--- Importamos o Assinante também
from django.shortcuts import get_object_or_404

api = NinjaAPI()

# ==========================================
# SCHEMAS E ROTAS DE NOTÍCIAS (O seu código original)
# ==========================================

# Schema para QUEM LÊ (Saída)
class NoticiaSchemaOut(Schema):
    id: int
    titulo: str
    resumo: str | None
    fonte_nome: str
    sentimento: str
    link_original: str
    data_publicacao: datetime

# Schema para QUEM CRIA (Entrada)
class NoticiaSchemaIn(Schema):
    titulo: str
    conteudo: str
    link_original: str
    fonte_nome: str
    resumo: str = None
    sentimento: str = 'NEU'
    data_publicacao: datetime = None

# Rota: GET (Listar Notícias)
@api.get("/noticias", response=List[NoticiaSchemaOut])
def listar_noticias(request):
    return Noticia.objects.all().order_by('-data_publicacao')

# Rota: POST (Criar Notícia)
@api.post("/noticias")
def criar_noticia(request, payload: NoticiaSchemaIn):
    nova_noticia = Noticia.objects.create(**payload.dict())
    return {"id": nova_noticia.id, "status": "criado com sucesso"}


# ==========================================
# SCHEMAS E ROTAS DE ASSINANTES (O NOVO CÓDIGO)
# ==========================================

class AssinanteSchemaIn(Schema):
    email: str

class AssinanteSchemaOut(Schema):
    id: int
    email: str
    data_inscricao: datetime

# Rota: POST (Criar Assinante - Usado pelo React)
@api.post("/assinantes/", response=AssinanteSchemaOut)
def criar_assinante(request, payload: AssinanteSchemaIn):
    # Verifica se já existe para não dar erro (o banco já exige unique=True, mas tratamos aqui)
    assinante, created = Assinante.objects.get_or_create(email=payload.email)
    return assinante

# Rota: GET (Listar Assinantes - Usado pelo n8n)
@api.get("/assinantes/", response=List[AssinanteSchemaOut])
def listar_assinantes(request):
    return Assinante.objects.all()