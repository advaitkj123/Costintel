from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AnomalyBase(BaseModel):
    service: str
    date: datetime
    expected_cost: float
    actual_cost: float
    severity: str
    status: str = "detected"

class AnomalyCreate(AnomalyBase):
    pass

class AnomalyResponse(AnomalyBase):
    id: int
    insight: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
