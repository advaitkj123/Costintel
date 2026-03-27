from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    workspace_name = Column(String)
    aws_access_key = Column(String)
    is_active = Column(Boolean, default=True)
