from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from app.core.database import get_db
from app.models.cost import CostRecord
from app.schemas.cost import CostResponse, CostCreate
from app.services.aws_cost import AWSCostService

router = APIRouter(prefix="/costs", tags=["costs"])

@router.get("/", response_model=List[CostResponse])
def get_costs(db: Session = Depends(get_db), limit: int = 100):
    costs = db.query(CostRecord).order_by(CostRecord.date.desc()).limit(limit).all()
    return costs

@router.post("/fetch", response_model=List[CostResponse])
def fetch_and_store_costs(days: int = 7, db: Session = Depends(get_db)):
    """
    Fetch costs from AWS Cost Explorer and store them in the database.
    """
    try:
        aws_service = AWSCostService()
        cost_data = aws_service.fetch_daily_costs(days=days)
        
        saved_records = []
        for record_data in cost_data:
            # Check if record for this date and service already exists
            record_date = datetime.strptime(record_data['date'], "%Y-%m-%d").date()
            existing = db.query(CostRecord).filter(
                CostRecord.date == record_date,
                CostRecord.service == record_data['service']
            ).first()
            
            if not existing:
                new_record = CostRecord(
                    date=record_date,
                    service=record_data['service'],
                    amount=record_data['amount'],
                    currency=record_data['currency']
                )
                db.add(new_record)
                saved_records.append(new_record)
            else:
                # Update existing
                existing.amount = record_data['amount']
                saved_records.append(existing)
                
        db.commit()
        return saved_records
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
