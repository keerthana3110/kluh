from typing import Optional
from sqlalchemy import String, Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Transaction(Base):
    __tablename__ = "transactions"

    spend_request_id: Mapped[str] = mapped_column(String(36), ForeignKey("spend_requests.id"), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    vendor: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="COMPLETED") # COMPLETED, FAILED, REFUNDED


class BlockchainRecord(Base):
    __tablename__ = "blockchain_records"

    spend_request_id: Mapped[str] = mapped_column(String(36), ForeignKey("spend_requests.id"), nullable=False)
    tx_hash: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    block_number: Mapped[int] = mapped_column(Integer, nullable=False)
    
    sender_address: Mapped[str] = mapped_column(String(100), nullable=False)
    app_id: Mapped[int] = mapped_column(Integer, nullable=False)
    payload_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    policy_version_hash: Mapped[str] = mapped_column(String(100), nullable=False)
    state_proof: Mapped[str] = mapped_column(String(255), nullable=False)
    verification_status: Mapped[str] = mapped_column(String(20), default="VERIFIED")

    spend_request: Mapped["SpendRequest"] = relationship("SpendRequest", back_populates="blockchain_record")
