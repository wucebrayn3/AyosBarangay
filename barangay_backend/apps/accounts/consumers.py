from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework_simplejwt.authentication import JWTAuthentication


class LiveUsersConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = await self._get_user()
        if not user or not user.is_authenticated:
            await self.close(code=4401)
            return

        if not (user.is_staff or user.is_superuser or getattr(user, "role", "") == "admin"):
            await self.close(code=4403)
            return

        await self.channel_layer.group_add("users_all", self.channel_name)
        await self.accept()
        await self.send_json({"type": "connection_ack", "message": "Connected to live user updates."})

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("users_all", self.channel_name)

    async def broadcast_event(self, event):
        await self.send_json(event["payload"])

    @database_sync_to_async
    def _get_user(self):
        user = self.scope.get("user")
        if user and user.is_authenticated:
            return user

        query_string = self.scope.get("query_string", b"").decode()
        params = dict(pair.split("=", 1) for pair in query_string.split("&") if "=" in pair)
        token = params.get("token")
        if not token:
            return user

        try:
            authenticator = JWTAuthentication()
            validated_token = authenticator.get_validated_token(token)
            return authenticator.get_user(validated_token)
        except Exception:
            return user
