from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.models.user import User, Role, Department
from app.schemas.auth import UserRegisterSchema, UserLoginSchema, TokenSchema, UserResponseSchema
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, decode_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponseSchema, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserRegisterSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="User email already registered.")

    hashed_pwd = get_password_hash(user_in.password)
    user = User(
        email=user_in.email,
        hashed_password=hashed_pwd,
        full_name=user_in.full_name,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login", response_model=TokenSchema)
async def login(user_in: UserLoginSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email, User.is_deleted == False))
    user = result.scalar_one_or_none()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    return TokenSchema(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenSchema)
async def refresh_token(token_in: str):
    payload = decode_token(token_in)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token.")
    
    user_id = payload.get("sub")
    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)
    return TokenSchema(access_token=access_token, refresh_token=refresh_token)


@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully."}
