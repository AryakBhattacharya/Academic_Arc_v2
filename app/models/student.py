from sqlalchemy import Column, Integer, String, Date
from app.database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    dob = Column(Date, nullable=False)
    school = Column(String(200), nullable=False)
    student_class = Column(String(50), nullable=False)