from datetime import datetime

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )

    phone: Mapped[str] = mapped_column(
        String(15),
        unique=True,
        index=True,
        nullable=False
    )

    is_student: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    profile_picture: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    district: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    village_locality: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )