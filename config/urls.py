# config/urls.py

from django.contrib import admin
from django.urls import path, re_path, include
from chat.views import ChatConsumer
from react.views import IndexView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Lang
    path("api/", include("lang.urls")),

    # WebSocket
    path('ws/chat/', ChatConsumer.as_asgi()),

    # React
    re_path(r'^.*$', IndexView.as_view()),
    
]
