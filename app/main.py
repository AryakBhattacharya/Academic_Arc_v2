from fastapi import FastAPI

from app.database import Base, engine
from app.models.user import User
from app.models.student import Student
from app.models.submission import Submission
from app.routes.auth import router as auth_router
from app.routes.student import router as student_router
from app.routes.submission import router as submission_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Academic Arc API"
)


app.include_router(auth_router)
app.include_router(student_router)
app.include_router(submission_router)


@app.get("/")
def root():
    return {
        "message": "Academic Arc API is running"
    }