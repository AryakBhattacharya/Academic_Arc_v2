from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.student import Student

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserSignup, UserLogin

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.student import Student
from app.services.auth import decode_access_token

from app.services.auth import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

security = HTTPBearer()

@router.post("/signup")
def signup(
    user_data: UserSignup,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        is_student=user_data.is_student,
        password_hash=hash_password(
            user_data.password
        )
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    new_student = None

    if user_data.is_student:
        new_student = Student(
            user_id=new_user.id,
            name=user_data.name,
            dob=user_data.dob,
            school=user_data.school,
            student_class=user_data.student_class
        )

        db.add(new_student)
        db.commit()
        db.refresh(new_student)

    return {
        "message": "User created successfully",
        "user_id": new_user.id,
        "student_id": new_student.id if new_student else None
    }

@router.post("/login")
def login(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(
            (User.email == user_data.identifier) |
            (User.phone == user_data.identifier)
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email/phone or password"
        )

    if not verify_password(
        user_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email/phone or password"
        )

    student = (
        db.query(Student)
        .filter(Student.user_id == user.id)
        .first()
    )

    access_token = create_access_token(user.id)

    return {
    "message": "Login successful",
    "user_id": user.id,
    "student_id": student.id if student else None,
    "access_token": access_token
}

@router.get("/me")
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(credentials.credentials)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user_id = payload.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    student = (
        db.query(Student)
        .filter(Student.user_id == user.id)
        .first()
    )

    return {
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "is_student": user.is_student,
        "student": {
            "student_id": student.id,
            "dob": student.dob,
            "school": student.school,
            "student_class": student.student_class
        } if student else None
    }