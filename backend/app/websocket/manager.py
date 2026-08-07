import json
from typing import List
from fastapi import WebSocket


class WebSocketManager:
    """Broadcaster for live Sentinel AI governance events across all connected clients."""

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast_event(self, event_type: str, data: dict):
        message = json.dumps({"event_type": event_type, "data": data})
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                pass


ws_manager = WebSocketManager()
