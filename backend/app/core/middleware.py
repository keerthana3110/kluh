import time
import json
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse
from app.config.settings import settings


class X402ProtocolMiddleware(BaseHTTPMiddleware):
    """
    Middleware that enforces RFC / HTTP 402 Payment Required headers on protected AI Agent spend endpoints.
    """
    async def dispatch(self, request: Request, call_next):
        # Enforce x402 protection on specific protected outbound agent spend execution routes
        if request.url.path.startswith("/api/v1/spend-request/protected-execute"):
            x402_auth = request.headers.get("X-402-Authorization")
            
            if not x402_auth:
                nonce = f"nonce_{int(time.time())}_{request.client.host if request.client else 'agent'}"
                return JSONResponse(
                    status_code=402,
                    content={
                        "error": "Payment Required",
                        "message": "Outbound spend request requires x402 micropayment authorization header.",
                        "x402_challenge": {
                            "realm": "Sentinel AI Agent Micropayments",
                            "nonce": nonce,
                            "currency": "USD"
                        }
                    },
                    headers={
                        "WWW-Authenticate": f'x402 realm="Sentinel AI Agent Micropayments", nonce="{nonce}"',
                        "X-402-Authorize": "required",
                        "X-402-Currency": "USD",
                        "X-402-Nonce": nonce
                    }
                )
        
        response = await call_next(request)
        return response
