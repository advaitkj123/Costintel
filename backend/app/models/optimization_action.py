from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class OptimizationAction(Base):
    __tablename__ = "optimization_actions"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String) # e.g., "Stopped idle EC2 instance i-0abcd123"
    service = Column(String, index=True) # EC2, S3, RDS
    savings_estimate = Column(Float)
    status = Column(String, default="success") # success, failed
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
