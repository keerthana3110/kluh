from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database.session import get_db
from app.models.spend_request import SpendRequest
from app.models.agent import Agent

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("", response_model=Dict[str, Any])
async def get_analytics(db: AsyncSession = Depends(get_db)):
    req_res = await db.execute(select(SpendRequest))
    requests = req_res.scalars().all()

    agent_res = await db.execute(select(Agent).where(Agent.is_deleted == False))
    agents = agent_res.scalars().all()

    total_today = sum(a.current_spend_today for a in agents)
    total_month = sum(a.current_spend_month for a in agents)
    total_budget_month = sum(a.monthly_budget for a in agents)

    blocked = [r for r in requests if r.status in ["blocked_by_policy", "blocked_by_budget"]]
    pending = [r for r in requests if r.status == "pending_approval"]
    approved = [r for r in requests if r.status in ["auto_approved", "approved"]]

    return {
        "today_spend": round(total_today, 2),
        "monthly_spend": round(total_month, 2),
        "budget_remaining": max(0.0, round(total_budget_month - total_month, 2)),
        "projected_monthly_spend": round(total_month * 1.15, 2),
        "total_requests": len(requests),
        "blocked_requests_count": len(blocked),
        "pending_approvals_count": len(pending),
        "approved_requests_count": len(approved),
        "top_spending_agents": [
            {"agent_name": a.name, "department": a.department.name if a.department else "Marketing", "spend_month": a.current_spend_month}
            for a in agents[:5]
        ]
    }
