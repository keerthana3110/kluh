from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class AgentCreateSchema(BaseModel):
    name: str
    department_name: str = "Marketing"
    owner_email: str
    daily_budget: float = Field(default=100.0, ge=0)
    monthly_budget: float = Field(default=2000.0, ge=0)
    risk_level: str = "Low"
    allowed_apis: List[str] = Field(default_factory=list)


class AgentUpdateSchema(BaseModel):
    name: Optional[str] = None
    daily_budget: Optional[float] = None
    monthly_budget: Optional[float] = None
    risk_level: Optional[str] = None
    status: Optional[str] = None
    allowed_apis: Optional[List[str]] = None


class AgentResponseSchema(BaseModel):
    id: str
    name: str
    department_name: str
    owner_email: str
    daily_budget: float
    monthly_budget: float
    current_spend_today: float
    current_spend_month: float
    risk_level: str
    status: str
    allowed_apis: List[str]

    model_config = ConfigDict(from_attributes=True)
