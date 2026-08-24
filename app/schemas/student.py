from datetime import date

from pydantic import BaseModel


class StudentCreate(BaseModel):
    name: str
    dob: date
    school: str
    student_class: str