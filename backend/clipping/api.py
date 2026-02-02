from ninja import NinjaAPI, Schema
from typing import List
from datetime import datetime  # <--- 1. ADICIONE ESTA IMPORTAÇÃO
from .models import Noticia
from django.shortcuts import get_object_or_404

api = NinjaAPI()

# Schema para QUEM LÊ (Saída)
class NoticiaSchemaOut(Schema):
    id: int
    titulo: str
    resumo: str | None
    fonte_nome: str
    sentimento: str
    link_original: str
    data_publicacao: datetime  # <--- 2. MUDAMOS DE 'str' PARA 'datetime'

# Schema para QUEM CRIA (Entrada)
class NoticiaSchemaIn(Schema):
    titulo: str
    conteudo: str
    link_original: str
    fonte_nome: str
    resumo: str = None
    sentimento: str = 'NEU'
    data_publicacao: datetime = None # <--- ADICIONAMOS ISSO AQUI

# Rota: GET (Listar)
@api.get("/noticias", response=List[NoticiaSchemaOut])
def listar_noticias(request):
    return Noticia.objects.all().order_by('-data_publicacao')

# Rota: POST (Criar)
@api.post("/noticias")
def criar_noticia(request, payload: NoticiaSchemaIn):
    nova_noticia = Noticia.objects.create(**payload.dict())
    return {"id": nova_noticia.id, "status": "criado com sucesso"}