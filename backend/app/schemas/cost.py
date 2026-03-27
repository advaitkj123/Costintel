from pydantic import BaseModel
from datetime import date, datetime

class CostBase(BaseModel):
    date: date
    service: str
    amount: float
    currency: str = "USD"

class CostCreate(CostBase):
    pass

class CostResponse(CostBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
