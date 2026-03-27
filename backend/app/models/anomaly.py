from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class AnomalyRecord(Base):
    __tablename__ = "anomaly_records"

    id = Column(Integer, primary_key=True, index=True)
    service = Column(String, index=True)
    date = Column(DateTime, index=True)
    expected_cost = Column(Float)
    actual_cost = Column(Float)
    severity = Column(String) # low, medium, high, critical
    status = Column(String, default="detected") # detected, resolving, resolved
    insight = Column(String, nullable=True) # AI-generated explanation
    created_at = Column(DateTime(timezone=True), server_default=func.now())
