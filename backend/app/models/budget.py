from typing import List, Optional
from sqlalchemy import String, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Budget(Base):
    __tablename__ = "budgets"

    department_name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    daily_allocated: Mapped[float] = mapped_column(Float, default=500.0)
    daily_spent: Mapped[float] = mapped_column(Float, default=0.0)
    monthly_allocated: Mapped[float] = mapped_column(Float, default=10000.0)
    monthly_spent: Mapped[float] = mapped_column(Float, default=0.0)
    projected_monthly: Mapped[float] = mapped_column(Float, default=0.0)
    
    status: Mapped[str] = mapped_column(String(20), default="active") # active, warning, frozen

    history_records: Mapped[List["BudgetHistory"]] = relationship("BudgetHistory", back_populates="budget")


class BudgetHistory(Base):
    __tablename__ = "budget_history"

    budget_id: Mapped[str] = mapped_column(String(36), ForeignKey("budgets.id"), nullable=False)
    period: Mapped[str] = mapped_column(String(20), nullable=False) # e.g. "2026-08-07"
    amount_spent: Mapped[float] = mapped_column(Float, nullable=False)
    request_count: Mapped[int] = mapped_column(default=0)

    budget: Mapped["Budget"] = relationship("Budget", back_populates="history_records")
