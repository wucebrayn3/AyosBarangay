from django.urls import path

from .consumers import LiveUsersConsumer

websocket_urlpatterns = [
    path("ws/users/", LiveUsersConsumer.as_asgi()),
]