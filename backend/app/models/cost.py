from sqlalchemy import Column, Integer, String, Float, Date, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class CostRecord(Base):
    __tablename__ = "cost_records"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    service = Column(String, index=True) # e.g., AmazonEC2
    amount = Column(Float)
    currency = Column(String, default="USD")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
