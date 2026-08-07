from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.models.agent import Agent
from app.models.user import Department, User
from app.schemas.agent import AgentCreateSchema, AgentUpdateSchema, AgentResponseSchema

router = APIRouter(prefix="/agents", tags=["Agents"])


@router.get("", response_model=List[AgentResponseSchema])
async def list_agents(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent).where(Agent.is_deleted == False))
    agents = result.scalars().all()
    
    # Map for response schema
    out = []
    for a in agents:
        out.append(AgentResponseSchema(
            id=a.id,
            name=a.name,
            department_name=a.department.name if a.department else "Marketing",
            owner_email=a.owner.email if a.owner else "owner@company.com",
            daily_budget=a.daily_budget,
            monthly_budget=a.monthly_budget,
            current_spend_today=a.current_spend_today,
            current_spend_month=a.current_spend_month,
            risk_level=a.risk_level,
            status=a.status,
            allowed_apis=a.allowed_apis or []
        ))
    return out


@router.post("", response_model=AgentResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_agent(agent_in: AgentCreateSchema, db: AsyncSession = Depends(get_db)):
    # Find or create department
    dept_res = await db.execute(select(Department).where(Department.name == agent_in.department_name))
    dept = dept_res.scalar_one_or_none()
    if not dept:
        dept = Department(name=agent_in.department_name)
        db.add(dept)
        await db.flush()

    # Find owner
    owner_res = await db.execute(select(User).where(User.email == agent_in.owner_email))
    owner = owner_res.scalar_one_or_none()
    if not owner:
        owner = User(email=agent_in.owner_email, hashed_password="default", full_name=agent_in.owner_email.split('@')[0])
        db.add(owner)
        await db.flush()

    agent = Agent(
        name=agent_in.name,
        department_id=dept.id,
        owner_id=owner.id,
        daily_budget=agent_in.daily_budget,
        monthly_budget=agent_in.monthly_budget,
        risk_level=agent_in.risk_level,
        allowed_apis=agent_in.allowed_apis,
    )
    db.add(agent)
    await db.commit()
    await db.refresh(agent)

    return AgentResponseSchema(
        id=agent.id,
        name=agent.name,
        department_name=dept.name,
        owner_email=owner.email,
        daily_budget=agent.daily_budget,
        monthly_budget=agent.monthly_budget,
        current_spend_today=0.0,
        current_spend_month=0.0,
        risk_level=agent.risk_level,
        status=agent.status,
        allowed_apis=agent.allowed_apis or []
    )


@router.patch("/{agent_id}", response_model=AgentResponseSchema)
async def update_agent(agent_id: str, agent_in: AgentUpdateSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent).where(Agent.id == agent_id, Agent.is_deleted == False))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found.")

    if agent_in.name is not None: agent.name = agent_in.name
    if agent_in.daily_budget is not None: agent.daily_budget = agent_in.daily_budget
    if agent_in.monthly_budget is not None: agent.monthly_budget = agent_in.monthly_budget
    if agent_in.risk_level is not None: agent.risk_level = agent_in.risk_level
    if agent_in.status is not None: agent.status = agent_in.status
    if agent_in.allowed_apis is not None: agent.allowed_apis = agent_in.allowed_apis

    await db.commit()
    await db.refresh(agent)

    return AgentResponseSchema(
        id=agent.id,
        name=agent.name,
        department_name=agent.department.name if agent.department else "Marketing",
        owner_email=agent.owner.email if agent.owner else "owner@company.com",
        daily_budget=agent.daily_budget,
        monthly_budget=agent.monthly_budget,
        current_spend_today=agent.current_spend_today,
        current_spend_month=agent.current_spend_month,
        risk_level=agent.risk_level,
        status=agent.status,
        allowed_apis=agent.allowed_apis or []
    )


@router.delete("/{agent_id}")
async def delete_agent(agent_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found.")
    agent.is_deleted = True
    await db.commit()
    return {"message": "Agent soft deleted."}
