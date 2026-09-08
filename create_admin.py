from app.database import SessionLocal
from app.models.user import User
from app.models.student import Student
from app.services.auth import hash_password


db = SessionLocal()

admin = User(
    name="Admin",
    email="academicarc.admin@gmail.com",
    phone="9932758396",
    is_student=False,
    role="admin",
    password_hash=hash_password("Academic@Admin")
)

db.add(admin)
db.commit()
db.refresh(admin)

print(f"Admin created successfully. ID: {admin.id}")

db.close()