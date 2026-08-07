from typing import Optional
from sqlalchemy import String, Float, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class RiskReport(Base):
    __tablename__ = "risk_reports"

    spend_request_id: Mapped[str] = mapped_column(String(36), ForeignKey("spend_requests.id"), nullable=False)
    risk_score: Mapped[int] = mapped_column(nullable=False) # 0 to 100
    risk_category: Mapped[str] = mapped_column(String(20), nullable=False) # Low, Medium, High, Critical
    
    factors_breakdown: Mapped[list] = mapped_column(JSON, default=list)
    reasoning: Mapped[str] = mapped_column(String(255), nullable=False)
    recommendation: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    spend_request: Mapped["SpendRequest"] = relationship("SpendRequest", back_populates="risk_report")
