from django.urls import path

from .consumers import IssueUpdatesConsumer

websocket_urlpatterns = [
    path("ws/issues/", IssueUpdatesConsumer.as_asgi()),
    path("ws/issues/purok/<int:purok_id>/", IssueUpdatesConsumer.as_asgi()),
]

