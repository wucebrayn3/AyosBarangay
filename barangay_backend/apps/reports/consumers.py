from channels.generic.websocket import AsyncJsonWebsocketConsumer


class IssueUpdatesConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.groups_to_join = ["issues_all"]
        purok_id = self.scope.get("url_route", {}).get("kwargs", {}).get("purok_id")
        if purok_id is not None:
            self.groups_to_join.append(f"issues_purok_{purok_id}")

        for group_name in self.groups_to_join:
            await self.channel_layer.group_add(group_name, self.channel_name)

        await self.accept()
        await self.send_json(
            {
                "type": "connection_ack",
                "message": "Connected to real-time updates.",
                "groups": self.groups_to_join,
            }
        )

    async def disconnect(self, close_code):
        for group_name in getattr(self, "groups_to_join", []):
            await self.channel_layer.group_discard(group_name, self.channel_name)

    async def broadcast_event(self, event):
        await self.send_json(event["payload"])

