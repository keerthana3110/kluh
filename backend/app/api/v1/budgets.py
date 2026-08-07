from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.models.budget import Budget
from app.models.agent import Agent

router = APIRouter(prefix="/budgets", tags=["Budgets"])


@router.get("", response_model=List[Dict[str, Any]])
async def get_budgets(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent).where(Agent.is_deleted == False))
    agents = result.scalars().all()
    
    out = []
    for a in agents:
        out.append({
            "agent_id": a.id,
            "agent_name": a.name,
            "department": a.department.name if a.department else "Marketing",
            "daily_budget": a.daily_budget,
            "daily_spent": a.current_spend_today,
            "monthly_budget": a.monthly_budget,
            "monthly_spent": a.current_spend_month,
            "remaining_monthly": max(0.0, a.monthly_budget - a.current_spend_month),
            "status": a.status
        })
    return out


@router.patch("/{agent_id}")
async def update_budget(agent_id: str, daily_budget: float, monthly_budget: float, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent).where(Agent.id == agent_id, Agent.is_deleted == False))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found.")
    
    agent.daily_budget = daily_budget
    agent.monthly_budget = monthly_budget
    await db.commit()
    return {"message": "Budget caps updated successfully."}
