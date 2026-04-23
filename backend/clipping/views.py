from django.shortcuts import render

# Dentro da sua view que salva a notícia (exemplo genérico)
def salvar_noticia(request):
    dados = json.loads(request.body)
    link = dados.get('link_original')
    
    # A MÁGICA ACONTECE AQUI:
    if Noticia.objects.filter(link_original=link).exists():
        return JsonResponse({"mensagem": "Notícia já existe, ignorada."}, status=200)
    
    # Se não existir, segue o código normal para salvar...
