from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.models.policy import Policy
from app.schemas.policy import PolicyCreateSchema, PolicyResponseSchema

router = APIRouter(prefix="/policies", tags=["Policies"])


@router.get("", response_model=List[PolicyResponseSchema])
async def list_policies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Policy).where(Policy.is_deleted == False))
    return result.scalars().all()


@router.post("", response_model=PolicyResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_policy(policy_in: PolicyCreateSchema, db: AsyncSession = Depends(get_db)):
    policy = Policy(
        name=policy_in.name,
        description=policy_in.description,
        department=policy_in.department,
        action=policy_in.action,
        max_single_spend=policy_in.max_single_spend,
        max_daily_amount=policy_in.max_daily_amount,
        allowed_vendors=policy_in.allowed_vendors,
        denied_models=policy_in.denied_models,
        condition_ast=policy_in.condition_ast,
        is_active=policy_in.is_active,
    )
    db.add(policy)
    await db.commit()
    await db.refresh(policy)
    return policy


@router.delete("/{policy_id}")
async def delete_policy(policy_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Policy).where(Policy.id == policy_id))
    policy = result.scalar_one_or_none()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found.")
    policy.is_deleted = True
    await db.commit()
    return {"message": "Policy soft deleted."}
