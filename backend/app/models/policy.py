from typing import List, Optional
from sqlalchemy import String, Float, Boolean, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Policy(Base):
    __tablename__ = "policies"

    name: Mapped[str] = mapped_column(String(150), index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    department: Mapped[str] = mapped_column(String(100), default="All", nullable=False) # "All" or Dept Name
    
    action: Mapped[str] = mapped_column(String(30), default="REQUIRE_APPROVAL") # ALLOW, DENY, REQUIRE_APPROVAL
    max_single_spend: Mapped[float] = mapped_column(Float, default=20.0)
    max_daily_amount: Mapped[float] = mapped_column(Float, default=100.0)
    
    allowed_vendors: Mapped[list] = mapped_column(JSON, default=list)
    denied_models: Mapped[list] = mapped_column(JSON, default=list)
    condition_ast: Mapped[dict] = mapped_column(JSON, default=dict) # AST rule tree representation
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    conditions: Mapped[List["PolicyCondition"]] = relationship("PolicyCondition", back_populates="policy")


class PolicyCondition(Base):
    __tablename__ = "policy_conditions"

    policy_id: Mapped[str] = mapped_column(String(36), ForeignKey("policies.id"), nullable=False)
    field_name: Mapped[str] = mapped_column(String(50), nullable=False) # amount, vendor, model, riskScore
    comparison_operator: Mapped[str] = mapped_column(String(20), nullable=False) # equals, greater_than, contains
    target_value: Mapped[str] = mapped_column(String(255), nullable=False)

    policy: Mapped["Policy"] = relationship("Policy", back_populates="conditions")
