from pydantic import BaseModel, EmailStr, Field
from datetime import date


class UserSignup(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100
    )

    email: EmailStr

    phone: str = Field(
        min_length=10,
        max_length=15
    )

    password: str = Field(
        min_length=8,
        max_length=100
    )

    dob: date

    school: str = Field(
        min_length=2,
        max_length=200
    )

    student_class: str = Field(
        min_length=1,
        max_length=50
    )

class UserLogin(BaseModel):
    identifier: str
    password: str