from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.database.database import get_db
from backend.database.models import LandRecord


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db)):

    total_land = db.query(LandRecord).count()

    acquired = db.query(LandRecord).filter(
        LandRecord.status == "Acquired"
    ).count()

    under_process = db.query(LandRecord).filter(
        LandRecord.status == "Under Process"
    ).count()

    disputed = db.query(LandRecord).filter(
        LandRecord.status == "Disputed"
    ).count()

    compensation_pending = db.query(LandRecord).filter(
        LandRecord.compensation_status == "Pending"
    ).count()

    total_area = db.query(
        func.sum(LandRecord.area_acres)
    ).scalar() or 0

    return {
        "total_land_records": total_land,
        "total_area_acres": round(total_area, 2),
        "acquired": acquired,
        "under_process": under_process,
        "disputed": disputed,
        "compensation_pending": compensation_pending
    }