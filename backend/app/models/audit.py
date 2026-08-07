from typing import Optional
from sqlalchemy import String, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    actor_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    actor_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    action: Mapped[str] = mapped_column(String(100), index=True, nullable=False) # SPEND_REQUEST, APPROVAL, POLICY_CREATE, etc.
    resource_type: Mapped[str] = mapped_column(String(50), nullable=False)
    resource_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    
    details: Mapped[dict] = mapped_column(JSON, default=dict)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)


class Notification(Base):
    __tablename__ = "notifications"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    message: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(50), default="INFO") # INFO, WARNING, APPROVAL_REQUIRED, POLICY_ALERT
    is_read: Mapped[bool] = mapped_column(default=False)
