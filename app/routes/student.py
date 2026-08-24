from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import Student
from app.schemas.student import StudentCreate


router = APIRouter(
    prefix="/students",
    tags=["Students"]
)

@router.get("/")
def get_students(db: Session = Depends(get_db)):
    return db.query(Student).all()

@router.post("/")
def create_student(
    student_data: StudentCreate,
    db: Session = Depends(get_db)
):
    new_student = Student(
        name=student_data.name,
        dob=student_data.dob,
        school=student_data.school,
        student_class=student_data.student_class
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return {
        "message": "Student created successfully",
        "student_id": new_student.id
    }