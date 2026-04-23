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
    
    # 🛡️ TRAVA DE ARQUITETURA: Verifica se o link já existe no banco
    if Noticia.objects.filter(link_original=payload.link_original).exists():
        # Retornamos sucesso (200) para o n8n não dar erro de "crash", mas avisamos que foi ignorado
        return {"status": "ignorado", "mensagem": "Notícia já cadastrada."}
    
    # Se a data vier vazia do React ou do n8n, preenchemos com a data e hora atual do servidor
    dados_para_salvar = payload.dict()
    if not dados_para_salvar.get('data_publicacao'):
        dados_para_salvar['data_publicacao'] = datetime.now()

    # Se passou pela trava, salva no banco definitivamente
    nova_noticia = Noticia.objects.create(**dados_para_salvar)
    return {"id": nova_noticia.id, "status": "criado com sucesso"}

# Rota: PUT (Atualizar Notícia)
@api.put("/noticias/{noticia_id}")
def atualizar_noticia(request, noticia_id: int, payload: NoticiaSchemaIn):
    noticia = get_object_or_404(Noticia, id=noticia_id)
    
    # Atualiza todos os campos enviados
    for attr, value in payload.dict().items():
        setattr(noticia, attr, value)
    
    noticia.save()
    return {"status": "sucesso", "mensagem": "Notícia atualizada com sucesso."}

# Rota: DELETE (Excluir Notícia)
@api.delete("/noticias/{noticia_id}")
def deletar_noticia(request, noticia_id: int):
    noticia = get_object_or_404(Noticia, id=noticia_id)
    noticia.delete()
    return {"status": "sucesso", "mensagem": "Notícia excluída."}


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