from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class RuleConditionAST(BaseModel):
    operator: str = "AND" # AND, OR, NOT
    rules: Optional[List[Dict[str, Any]]] = None
    nested: Optional[List["RuleConditionAST"]] = None


class PolicyCreateSchema(BaseModel):
    name: str
    description: Optional[str] = None
    department: str = "All"
    action: str = "REQUIRE_APPROVAL" # ALLOW, DENY, REQUIRE_APPROVAL
    max_single_spend: float = Field(default=20.0, ge=0)
    max_daily_amount: float = Field(default=100.0, ge=0)
    allowed_vendors: List[str] = Field(default_factory=list)
    denied_models: List[str] = Field(default_factory=list)
    condition_ast: Dict[str, Any] = Field(default_factory=dict)
    is_active: bool = True


class PolicyResponseSchema(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    department: str
    action: str
    max_single_spend: float
    max_daily_amount: float
    allowed_vendors: List[str]
    denied_models: List[str]
    condition_ast: Dict[str, Any]
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
