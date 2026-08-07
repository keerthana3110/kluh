from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.models.spend_request import SpendRequest
from app.models.agent import Agent
from app.models.policy import Policy
from app.schemas.spend_request import SpendRequestCreateSchema, SpendRequestResponseSchema
from app.services.spend_service import SpendService

router = APIRouter(prefix="/spend-request", tags=["Spend Requests"])


@router.get("", response_model=List[SpendRequestResponseSchema])
async def list_spend_requests(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SpendRequest).order_by(SpendRequest.created_at.desc()))
    return result.scalars().all()


@router.post("", response_model=SpendRequestResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_spend_request(req_in: SpendRequestCreateSchema, db: AsyncSession = Depends(get_db)):
    # 1. Fetch Agent
    agent_res = await db.execute(select(Agent).where(Agent.id == req_in.agent_id, Agent.is_deleted == False))
    agent = agent_res.scalar_one_or_none()
    
    agent_name = agent.name if agent else "Default Agent"
    department = agent.department.name if agent and agent.department else "Marketing"
    daily_budget = agent.daily_budget if agent else 100.0
    monthly_budget = agent.monthly_budget if agent else 2000.0
    current_today = agent.current_spend_today if agent else 0.0
    current_month = agent.current_spend_month if agent else 0.0

    # 2. Fetch Active Policies
    policy_res = await db.execute(select(Policy).where(Policy.is_active == True, Policy.is_deleted == False))
    policies = policy_res.scalars().all()
    policy_dicts = [
        {
            "name": p.name,
            "department": p.department,
            "action": p.action,
            "max_single_spend": p.max_single_spend,
            "max_daily_amount": p.max_daily_amount,
            "allowed_vendors": p.allowed_vendors or [],
            "denied_models": p.denied_models or [],
            "condition_ast": p.condition_ast or {}
        } for p in policies
    ]

    # 3. Process through Pipeline Orchestrator
    processed = await SpendService.process_spend_request(
        agent_id=req_in.agent_id,
        agent_name=agent_name,
        department=department,
        vendor=req_in.vendor,
        api_endpoint=req_in.api_endpoint,
        requested_model=req_in.requested_model,
        amount=req_in.amount,
        purpose=req_in.purpose,
        active_policies=policy_dicts,
        agent_daily_budget=daily_budget,
        agent_monthly_budget=monthly_budget,
        agent_current_today=current_today,
        agent_current_month=current_month
    )

    # 4. Save to Database
    db_req = SpendRequest(
        id=processed["id"],
        agent_id=req_in.agent_id,
        agent_name=agent_name,
        department=department,
        vendor=req_in.vendor,
        api_endpoint=req_in.api_endpoint,
        requested_model=req_in.requested_model,
        amount=req_in.amount,
        purpose=req_in.purpose,
        risk_score=processed["risk_score"],
        risk_factors=processed["risk_factors"],
        status=processed["status"],
        approval_tier=processed["approval_tier"],
        rejection_reason=processed["rejection_reason"],
        algorand_tx_hash=processed["algorand_tx_hash"],
        algorand_block=processed["algorand_block"],
        payload_hash=processed["payload_hash"],
        x402_token=processed["x402_token"],
        x402_status=processed["x402_status"],
        recommendation=processed["recommendation"],
    )
    db.add(db_req)

    if agent and processed["status"] == "auto_approved":
        agent.current_spend_today += req_in.amount
        agent.current_spend_month += req_in.amount

    await db.commit()
    await db.refresh(db_req)
    return db_req


@router.post("/protected-execute")
async def protected_execute_api(req_in: SpendRequestCreateSchema, db: AsyncSession = Depends(get_db)):
    """Protected endpoint enforced by x402 Authorization Middleware."""
    return await create_spend_request(req_in, db)
