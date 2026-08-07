from typing import List, Optional
from sqlalchemy import String, Float, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class SpendRequest(Base):
    __tablename__ = "spend_requests"

    agent_id: Mapped[str] = mapped_column(String(36), ForeignKey("agents.id"), nullable=False)
    agent_name: Mapped[str] = mapped_column(String(100), nullable=False)
    department: Mapped[str] = mapped_column(String(100), nullable=False)
    
    vendor: Mapped[str] = mapped_column(String(100), nullable=False)
    api_endpoint: Mapped[str] = mapped_column(String(255), nullable=False)
    requested_model: Mapped[str] = mapped_column(String(100), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    purpose: Mapped[str] = mapped_column(String(255), nullable=False)
    
    risk_score: Mapped[int] = mapped_column(default=0)
    risk_factors: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(30), default="auto_approved") # auto_approved, pending_approval, approved, rejected, blocked_by_policy, blocked_by_budget
    approval_tier: Mapped[str] = mapped_column(String(20), default="None") # None, Manager, Finance, Executive
    
    rejection_reason: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    approved_by: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    algorand_tx_hash: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    algorand_block: Mapped[Optional[int]] = mapped_column(nullable=True)
    payload_hash: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    
    x402_token: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    x402_status: Mapped[str] = mapped_column(String(20), default="BYPASSED") # CHALLENGED, AUTHORIZED, SETTLED, BYPASSED
    
    recommendation: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    agent: Mapped["Agent"] = relationship("Agent", back_populates="spend_requests")
    approvals: Mapped[List["Approval"]] = relationship("Approval", back_populates="spend_request")
    risk_report: Mapped[Optional["RiskReport"]] = relationship("RiskReport", back_populates="spend_request", uselist=False)
    blockchain_record: Mapped[Optional["BlockchainRecord"]] = relationship("BlockchainRecord", back_populates="spend_request", uselist=False)


class Approval(Base):
    __tablename__ = "approvals"

    spend_request_id: Mapped[str] = mapped_column(String(36), ForeignKey("spend_requests.id"), nullable=False)
    required_tier: Mapped[str] = mapped_column(String(20), nullable=False) # Manager, Finance, Executive
    status: Mapped[str] = mapped_column(String(20), default="Pending") # Pending, Approved, Rejected, Expired, Cancelled
    
    assigned_user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    action_by_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    comment: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    spend_request: Mapped["SpendRequest"] = relationship("SpendRequest", back_populates="approvals")
    histories: Mapped[List["ApprovalHistory"]] = relationship("ApprovalHistory", back_populates="approval")


class ApprovalHistory(Base):
    __tablename__ = "approval_history"

    approval_id: Mapped[str] = mapped_column(String(36), ForeignKey("approvals.id"), nullable=False)
    previous_status: Mapped[str] = mapped_column(String(20), nullable=False)
    new_status: Mapped[str] = mapped_column(String(20), nullable=False)
    changed_by: Mapped[str] = mapped_column(String(255), nullable=False)
    reason: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    approval: Mapped["Approval"] = relationship("Approval", back_populates="histories")
