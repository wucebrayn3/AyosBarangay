from channels.generic.websocket import AsyncJsonWebsocketConsumer


class LiveUsersConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope.get("user")
        if not user or not user.is_authenticated:
            await self.close(code=4401)
            return

        if not (user.is_superuser or getattr(user, "role", "") == "admin"):
            await self.close(code=4403)
            return

        await self.channel_layer.group_add("users_all", self.channel_name)
        await self.accept()
        await self.send_json({"type": "connection_ack", "message": "Connected to live user updates."})

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("users_all", self.channel_name)

    async def broadcast_event(self, event):
        await self.send_json(event["payload"])