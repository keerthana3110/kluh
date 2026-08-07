from typing import Dict, Any
from fastapi import APIRouter
from pydantic import BaseModel
from app.engines.risk_engine import RiskEngine


class RiskAnalysisRequest(BaseModel):
    amount: float
    vendor: str
    requested_model: str
    request_velocity: int = 1


router = APIRouter(prefix="/risk-analysis", tags=["Risk Engine"])


@router.post("", response_model=Dict[str, Any])
async def analyze_risk(payload: RiskAnalysisRequest):
    return RiskEngine.evaluate_risk(payload.model_dump(), request_velocity=payload.request_velocity)
