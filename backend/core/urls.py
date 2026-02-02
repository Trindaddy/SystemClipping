from django.contrib import admin
from django.urls import path
from clipping.api import api # <--- Importe a API

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls), # <--- Adicione esta linha
]