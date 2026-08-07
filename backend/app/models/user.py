from typing import List, Optional
from sqlalchemy import String, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Role(Base):
    __tablename__ = "roles"

    name: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False) # Admin, Manager, Employee
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    permissions: Mapped[dict] = mapped_column(JSON, default=dict)

    users: Mapped[List["User"]] = relationship("User", back_populates="role")


class Department(Base):
    __tablename__ = "departments"

    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False) # Marketing, Coding, Travel, etc.
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    monthly_budget_limit: Mapped[float] = mapped_column(default=10000.0)

    users: Mapped[List["User"]] = relationship("User", back_populates="department")
    agents: Mapped[List["Agent"]] = relationship("Agent", back_populates="department")


class User(Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)

    role_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("roles.id"), nullable=True)
    department_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("departments.id"), nullable=True)

    role: Mapped[Optional["Role"]] = relationship("Role", back_populates="users")
    department: Mapped[Optional["Department"]] = relationship("Department", back_populates="users")
    agents_owned: Mapped[List["Agent"]] = relationship("Agent", back_populates="owner")
