from typing import List, Optional
from sqlalchemy import String, Float, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Agent(Base):
    __tablename__ = "agents"

    name: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    department_id: Mapped[str] = mapped_column(String(36), ForeignKey("departments.id"), nullable=False)
    owner_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    
    daily_budget: Mapped[float] = mapped_column(Float, default=100.0)
    monthly_budget: Mapped[float] = mapped_column(Float, default=2000.0)
    current_spend_today: Mapped[float] = mapped_column(Float, default=0.0)
    current_spend_month: Mapped[float] = mapped_column(Float, default=0.0)
    
    risk_level: Mapped[str] = mapped_column(String(20), default="Low") # Low, Medium, High, Critical
    status: Mapped[str] = mapped_column(String(20), default="active") # active, paused, blocked
    allowed_apis: Mapped[list] = mapped_column(JSON, default=list)

    department: Mapped["Department"] = relationship("Department", back_populates="agents")
    owner: Mapped["User"] = relationship("User", back_populates="agents_owned")
    spend_requests: Mapped[List["SpendRequest"]] = relationship("SpendRequest", back_populates="agent")
    permissions: Mapped[List["AgentPermission"]] = relationship("AgentPermission", back_populates="agent")


class AgentPermission(Base):
    __tablename__ = "agent_permissions"

    agent_id: Mapped[str] = mapped_column(String(36), ForeignKey("agents.id"), nullable=False)
    vendor: Mapped[str] = mapped_column(String(100), nullable=False)
    api_endpoint: Mapped[str] = mapped_column(String(255), nullable=False)
    max_amount_per_request: Mapped[float] = mapped_column(Float, default=50.0)
    is_allowed: Mapped[bool] = mapped_column(default=True)

    agent: Mapped["Agent"] = relationship("Agent", back_populates="permissions")
