import base64

from sqlalchemy.orm import Session

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import Response

import uuid
from app.supabase import supabase

from app.database import get_db
from app.models.submission import Submission
from app.schemas.submission import SubmissionCreate
from app.models.user import User
from app.services.auth import get_current_user, decode_access_token

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(
    prefix="/submissions",
    tags=["Submissions"]
)

security = HTTPBearer()


@router.post("/")
def create_submission(
    submission_data: SubmissionCreate,
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

    new_submission = Submission(
        content_type=submission_data.content_type,
        user_id=user_id,
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


@router.post("/upload")
async def upload_submission_file(
    submission_id: int,
    file: UploadFile = File(...),
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

    submission = db.query(Submission).filter(
        Submission.id == submission_id,
        Submission.user_id == user_id
    ).first()

    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Submission not found"
        )

    # Get file extension
    file_extension = file.filename.split(".")[-1]

    # Generate unique filename
    file_name = f"{uuid.uuid4()}.{file_extension}"

    # Read file
    file_bytes = await file.read()

    # Upload to Supabase Storage
    response = supabase.storage.from_("submissions").upload(
        path=file_name,
        file=file_bytes,
        file_options={
            "content-type": file.content_type,
            "upsert": "false"
        }
    )

    # Save the Supabase file URL in the database
    public_url = supabase.storage.from_("submissions").get_public_url(file_name)

    submission.media_url = public_url
    submission.media_type = file.content_type

    db.commit()
    db.refresh(submission)

    return {
        "message": "File uploaded successfully",
        "submission_id": submission.id,
        "file_name": file_name
    }


@router.get("/")
def get_submissions(
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

    submissions = db.query(Submission).filter(
        Submission.user_id == user_id
    ).all()

    results = []

    for submission in submissions:

        results.append({
            "id": submission.id,
            "content_type": submission.content_type,
            "user_id": submission.user_id,
            "student_class": submission.student_class,
            "heading": submission.heading,
            "description": submission.description,
            "written_content": submission.written_content,
            "media_url": submission.media_url,
            "media_type": submission.media_type,
            "created_at": submission.created_at
        })

    return results

@router.get("/public")
def get_public_submissions(
    db: Session = Depends(get_db)
):
    submissions = db.query(Submission).all()

    results = []

    for submission in submissions:
        results.append({
            "id": submission.id,
            "content_type": submission.content_type,
            "student_class": submission.student_class,
            "heading": submission.heading,
            "description": submission.description,
            "written_content": submission.written_content,
            "media_url": submission.media_url,
            "media_type": submission.media_type,
            "created_at": submission.created_at,
        })

    return results


@router.get("/{submission_id}/media")
def get_submission_media(
    submission_id: int,
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

    submission = db.query(Submission).filter(
        Submission.id == submission_id,
        Submission.user_id == user_id
    ).first()

    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Submission not found"
        )

    if not submission.media_url:
        raise HTTPException(
            status_code=404,
            detail="No media found for this submission"
        )

    file_name = submission.media_url.split("/")[-1]

    file_bytes = supabase.storage.from_("submissions").download(file_name)

    return Response(
        content=file_bytes,
        media_type=submission.media_type
    )