from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from fastapi import APIRouter, Depends, HTTPException

from app.models.user import User
from app.models.student import Student
from app.models.submission import Submission
from app.models.featured import SpecialFeature

from app.services.auth import get_current_admin

from app.supabase import supabase


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/me")
def admin_me(
    admin: User = Depends(get_current_admin)
):
    return {
        "message": "Admin access verified",
        "admin_id": admin.id,
        "name": admin.name,
        "email": admin.email
    }

@router.get("/posts")
def get_admin_posts(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    posts = (
        db.query(Submission, User, Student)
        .join(User, Submission.user_id == User.id)
        .outerjoin(Student, Student.user_id == User.id)
        .order_by(Submission.created_at.desc())
        .all()
    )

    results = []

    for submission, user, student in posts:
        results.append({
            "id": submission.id,
            "content_type": submission.content_type,
            "heading": submission.heading,
            "description": submission.description,
            "written_content": submission.written_content,
            "media_url": submission.media_url,
            "media_type": submission.media_type,
            "created_at": submission.created_at,

            "user_id": user.id,
            "user_name": user.name,
            "user_email": user.email,
            "is_student": user.is_student,

            "school": student.school if student else None,
            "student_class": submission.student_class
        })

    return results

@router.get("/posts/{submission_id}")
def get_admin_post(
    submission_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    result = (
        db.query(Submission, User, Student)
        .join(User, Submission.user_id == User.id)
        .outerjoin(Student, Student.user_id == User.id)
        .filter(Submission.id == submission_id)
        .first()
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    submission, user, student = result

    return {
        "id": submission.id,
        "content_type": submission.content_type,
        "heading": submission.heading,
        "description": submission.description,
        "written_content": submission.written_content,
        "media_url": submission.media_url,
        "media_type": submission.media_type,
        "created_at": submission.created_at,

        "user_id": user.id,
        "user_name": user.name,
        "user_email": user.email,
        "is_student": user.is_student,

        "school": student.school if student else None,
        "student_class": submission.student_class
    }

@router.delete("/posts/{submission_id}")
def delete_admin_post(
    submission_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    submission = (
        db.query(Submission)
        .filter(Submission.id == submission_id)
        .first()
    )

    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    # Delete uploaded media from Supabase Storage
    if submission.media_url:
        if "supabase" in submission.media_url:
            file_name = submission.media_url.split("/")[-1]

            try:
                supabase.storage.from_("submissions").remove(
                    [file_name]
                )
            except Exception as error:
                print(
                    f"Could not delete media file: {error}"
                )

    db.delete(submission)
    db.commit()

    return {
        "message": "Post deleted successfully",
        "submission_id": submission_id
    }

@router.get("/categories")
def get_admin_categories(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    categories = (
        db.query(
            Submission.content_type,
            func.count(Submission.id).label("post_count")
        )
        .group_by(Submission.content_type)
        .order_by(Submission.content_type)
        .all()
    )

    return [
        {
            "name": category,
            "post_count": post_count
        }
        for category, post_count in categories
    ]

@router.get("/featured")
def get_admin_featured(
    admin: User = Depends(get_current_admin),
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
            "id": special_feature.id,
            "submission_id": submission.id,
            "heading": submission.heading,
            "description": submission.description,
            "content_type": submission.content_type,
            "media_url": submission.media_url,
            "media_type": submission.media_type,
            "created_at": submission.created_at,

            "user_id": user.id,
            "user_name": user.name,
            "is_student": user.is_student,

            "school": student.school if student else None,
            "student_class": submission.student_class,

            "featured_at": special_feature.created_at
        })

    return results

@router.post("/featured/{submission_id}")
def add_special_feature(
    submission_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    submission = (
        db.query(Submission)
        .filter(Submission.id == submission_id)
        .first()
    )

    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    existing_feature = (
        db.query(SpecialFeature)
        .filter(
            SpecialFeature.submission_id == submission_id
        )
        .first()
    )

    if existing_feature:
        raise HTTPException(
            status_code=400,
            detail="Post is already a special mention"
        )

    special_feature = SpecialFeature(
        submission_id=submission_id
    )

    db.add(special_feature)
    db.commit()
    db.refresh(special_feature)

    return {
        "message": "Post added to special mentions",
        "submission_id": submission_id
    }

@router.delete("/featured/{submission_id}")
def remove_special_feature(
    submission_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    special_feature = (
        db.query(SpecialFeature)
        .filter(
            SpecialFeature.submission_id == submission_id
        )
        .first()
    )

    if not special_feature:
        raise HTTPException(
            status_code=404,
            detail="Post is not a special mention"
        )

    db.delete(special_feature)
    db.commit()

    return {
        "message": "Post removed from special mentions",
        "submission_id": submission_id
    }