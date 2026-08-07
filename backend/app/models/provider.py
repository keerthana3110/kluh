from typing import Optional
from sqlalchemy import String, Integer, Boolean, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base


class APIKeyPool(Base):
    __tablename__ = "api_key_pools"

    provider_name: Mapped[str] = mapped_column(String(50), index=True, nullable=False) # Gemini, Grok, OpenRouter, Ollama
    key_masked: Mapped[str] = mapped_column(String(100), nullable=False)
    secret_key: Mapped[str] = mapped_column(String(255), nullable=False)
    
    key_index: Mapped[int] = mapped_column(Integer, default=0)
    calls_today: Mapped[int] = mapped_column(Integer, default=0)
    quota_limit: Mapped[int] = mapped_column(Integer, default=5000)
    
    status: Mapped[str] = mapped_column(String(20), default="healthy") # healthy, warning, cooldown, exhausted
    error_count: Mapped[int] = mapped_column(Integer, default=0)
    cooldown_until: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)


class ProviderLog(Base):
    __tablename__ = "provider_logs"

    provider_name: Mapped[str] = mapped_column(String(50), nullable=False)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    key_used: Mapped[str] = mapped_column(String(100), nullable=False)
    
    tokens_estimated: Mapped[int] = mapped_column(default=0)
    cost_estimated: Mapped[float] = mapped_column(Float, default=0.0)
    latency_ms: Mapped[float] = mapped_column(Float, default=0.0)
    status_code: Mapped[int] = mapped_column(default=200)
    is_success: Mapped[bool] = mapped_column(default=True)
