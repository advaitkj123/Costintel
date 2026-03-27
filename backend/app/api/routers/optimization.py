from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.optimization_action import OptimizationAction
from app.schemas.optimization import OptimizationActionResponse, OptimizationActionCreate

router = APIRouter(prefix="/actions", tags=["actions"])

@router.get("/", response_model=List[OptimizationActionResponse])
def get_actions(db: Session = Depends(get_db)):
    return db.query(OptimizationAction).order_by(OptimizationAction.timestamp.desc()).all()

@router.post("/", response_model=OptimizationActionResponse)
def create_action(action: OptimizationActionCreate, db: Session = Depends(get_db)):
    db_action = OptimizationAction(**action.model_dump())
    db.add(db_action)
    db.commit()
    db.refresh(db_action)
    return db_action
