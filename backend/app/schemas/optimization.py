from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class OptimizationActionBase(BaseModel):
    description: str
    service: str
    savings_estimate: float
    status: str = "success"

class OptimizationActionCreate(OptimizationActionBase):
    pass

class OptimizationActionResponse(OptimizationActionBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
