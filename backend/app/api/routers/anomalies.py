from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.core.database import get_db
from app.models.cost import CostRecord
from app.models.anomaly import AnomalyRecord
from app.schemas.anomaly import AnomalyResponse
from app.services.anomaly_detection import AnomalyDetectionService

router = APIRouter(prefix="/anomalies", tags=["anomalies"])

@router.get("/", response_model=List[AnomalyResponse])
def get_anomalies(db: Session = Depends(get_db)):
    return db.query(AnomalyRecord).order_by(AnomalyRecord.created_at.desc()).all()

@router.post("/detect", response_model=List[AnomalyResponse])
def detect_anomalies_endpoint(db: Session = Depends(get_db)):
    """
    Trigger anomaly detection on existing cost data.
    """
    try:
        # Fetch all cost records (in a real app, you'd filter by recent dates)
        costs = db.query(CostRecord).order_by(CostRecord.date.asc()).all()
        
        # Serialize for the service
        cost_dicts = [
            {
                "date": c.date.strftime("%Y-%m-%d"),
                "service": c.service,
                "amount": c.amount
            }
            for c in costs
        ]
        
        detector = AnomalyDetectionService()
        detected_anomalies = detector.detect_anomalies(cost_dicts)
        
        saved_anomalies = []
        for anomaly in detected_anomalies:
            anomaly_date = datetime.strptime(anomaly['date'], "%Y-%m-%d")
            
            # Check if this anomaly was already detected
            existing = db.query(AnomalyRecord).filter(
                AnomalyRecord.date == anomaly_date,
                AnomalyRecord.service == anomaly['service']
            ).first()
            
            if not existing:
                new_record = AnomalyRecord(
                    service=anomaly['service'],
                    date=anomaly_date,
                    expected_cost=anomaly['expected_cost'],
                    actual_cost=anomaly['actual_cost'],
                    severity=anomaly['severity'],
                    status=anomaly['status'],
                    insight=anomaly['insight']
                )
                db.add(new_record)
                saved_anomalies.append(new_record)
                
        db.commit()
        
        # We also need to refresh the session objects to get generated IDs properly if we return them
        # Pydantic's from_attributes handles it if they're attached.
        return saved_anomalies
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
