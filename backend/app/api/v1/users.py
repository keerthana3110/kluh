from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import UserResponseSchema

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=List[UserResponseSchema])
async def list_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.is_deleted == False))
    return result.scalars().all()


@router.get("/{user_id}", response_model=UserResponseSchema)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id, User.is_deleted == False))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


@router.delete("/{user_id}")
async def delete_user(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    user.is_deleted = True
    await db.commit()
    return {"message": "User soft deleted."}
