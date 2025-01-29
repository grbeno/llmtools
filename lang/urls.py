from django.urls import path
from .views import LangAI

urlpatterns = [
    path('lang/', LangAI.as_view(), name='lang'),
]