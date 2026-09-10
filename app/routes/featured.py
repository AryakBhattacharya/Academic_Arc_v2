from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.featured import SpecialFeature
from app.models.submission import Submission
from app.models.user import User
from app.models.student import Student


router = APIRouter(
    prefix="/featured",
    tags=["Featured"]
)


@router.get("/")
def get_public_featured(
    db: Session = Depends(get_db)
):
    special_features = (
        db.query(SpecialFeature, Submission, User, Student)
        .join(
            Submission,
            SpecialFeature.submission_id == Submission.id
        )
        .join(
            User,
            Submission.user_id == User.id
        )
        .outerjoin(
            Student,
            Student.user_id == User.id
        )
        .order_by(SpecialFeature.created_at.desc())
        .all()
    )

    results = []

    for special_feature, submission, user, student in special_features:
        results.append({
            "id": submission.id,
            "content_type": submission.content_type,
            "student_name": user.name,
            "student_class": submission.student_class,
            "school": student.school if student else None,
            "profile_picture": user.profile_picture,
            "heading": submission.heading,
            "description": submission.description,
            "written_content": submission.written_content,
            "media_url": submission.media_url,
            "media_type": submission.media_type,
            "created_at": submission.created_at,
            "featured_at": special_feature.created_at
        })

    return results