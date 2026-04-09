from django.db import models

class Noticia(models.Model):
    # Campos obrigatórios para qualquer clipping
    titulo = models.CharField(max_length=500)
    conteudo = models.TextField() # Texto completo ou transcrição
    resumo = models.TextField(blank=True, null=True) # IA vai preencher depois
    link_original = models.URLField(max_length=1000)
    
    # Classificação (IA ou Humano)
    SENTIMENTOS = [('POS', 'Positivo'), ('NEG', 'Negativo'), ('NEU', 'Neutro')]
    sentimento = models.CharField(max_length=3, choices=SENTIMENTOS, default='NEU')
    
    # Dados da Fonte
    fonte_nome = models.CharField(max_length=100, help_text="Ex: G1, Globo Minas")
    data_publicacao = models.DateTimeField()
    data_coleta = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo
    
# A classe Assinante precisa ficar alinhada na borda, fora da Noticia
class Assinante(models.Model):
    email = models.EmailField(unique=True)
    data_inscricao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email