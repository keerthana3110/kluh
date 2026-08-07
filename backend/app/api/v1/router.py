from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.agents import router as agents_router
from app.api.v1.policies import router as policies_router
from app.api.v1.budgets import router as budgets_router
from app.api.v1.spend_requests import router as spend_router
from app.api.v1.approvals import router as approvals_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.risk import router as risk_router
from app.api.v1.blockchain import router as blockchain_router
from app.api.v1.providers import router as providers_router

api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(auth_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(agents_router)
api_v1_router.include_router(policies_router)
api_v1_router.include_router(budgets_router)
api_v1_router.include_router(spend_router)
api_v1_router.include_router(approvals_router)
api_v1_router.include_router(analytics_router)
api_v1_router.include_router(risk_router)
api_v1_router.include_router(blockchain_router)
api_v1_router.include_router(providers_router)
