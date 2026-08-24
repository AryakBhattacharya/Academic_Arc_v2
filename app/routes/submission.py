from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.submission import Submission
from app.schemas.submission import SubmissionCreate


router = APIRouter(
    prefix="/submissions",
    tags=["Submissions"]
)


@router.post("/")
def create_submission(
    submission_data: SubmissionCreate,
    db: Session = Depends(get_db)
):
    new_submission = Submission(
        content_type=submission_data.content_type,
        student_class=submission_data.student_class,
        heading=submission_data.heading,
        description=submission_data.description,
        written_content=submission_data.written_content,
        media_url=submission_data.media_url,
        media_type=submission_data.media_type
    )

    db.add(new_submission)
    db.commit()
    db.refresh(new_submission)

    return {
        "message": "Submission created successfully",
        "submission_id": new_submission.id
    }