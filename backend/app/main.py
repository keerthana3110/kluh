from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config.settings import settings
from app.database.session import init_db
from app.core.middleware import X402ProtocolMiddleware
from app.websocket.manager import ws_manager
from app.api.v1.router import api_v1_router
from app.core.logging import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup DB initialization
    logger.info("Initializing Sentinel AI Database...")
    await init_db()
    yield
    logger.info("Shutting down Sentinel AI Backend Proxy...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Financial Operating System & Governance Layer for Autonomous AI Agents.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# x402 Protocol Header Authorization Middleware
app.add_middleware(X402ProtocolMiddleware)

# Include v1 REST APIs
app.include_router(api_v1_router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "x402_protocol": "enforced",
        "algorand_network": "mainnet",
    }


# WebSockets Live Event Stream
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo heartbeat or client messages
            await websocket.send_text(f"ACK: {data}")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)


# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global Exception on {request.url.path}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": str(exc) if settings.DEBUG else "An unexpected error occurred."
        }
    )
