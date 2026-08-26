from sqlalchemy import Column, Integer, String, Date, ForeignKey
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

    name = Column(String(100), nullable=False)
    dob = Column(Date, nullable=False)
    school = Column(String(200), nullable=False)
    student_class = Column(String(50), nullable=False)