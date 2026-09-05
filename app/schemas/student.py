from datetime import date

from pydantic import BaseModel


class StudentCreate(BaseModel):
    user_id: int
    school: str
    student_class: str