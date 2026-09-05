from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    school = Column(
        String(200),
        nullable=False
    )

    student_class = Column(
        String(50),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="student"
    )