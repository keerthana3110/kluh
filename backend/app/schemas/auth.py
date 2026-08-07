from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


class UserRegisterSchema(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    department_name: Optional[str] = "Marketing"
    role_name: Optional[str] = "Employee"


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str


class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponseSchema(BaseModel):
    id: str
    email: str
    full_name: str
    is_active: bool
    role_name: Optional[str] = None
    department_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
