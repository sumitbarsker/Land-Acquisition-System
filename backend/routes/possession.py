from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime

from backend.database.database import get_db
from backend.database.models import PossessionRecord


router = APIRouter(
    prefix="/possession",
    tags=["Possession Management"]
)


class PossessionRequest(BaseModel):
    project_id: str
    land_id: str
    possession_status: str = "Completed"
    remarks: str = ""


@router.post("/")
def create_possession(
    data: PossessionRequest,
    db: Session = Depends(get_db)
):

    existing = db.query(PossessionRecord).filter(
        PossessionRecord.land_id == data.land_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Possession record already exists for this land."
        )

    record = PossessionRecord(
        project_id=data.project_id,
        land_id=data.land_id,
        possession_date=datetime.now().strftime(
            "%d %b %Y"
        ),
        possession_status=data.possession_status,
        remarks=data.remarks
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "message": "Possession record created successfully",
        "possession": {
            "id": record.id,
            "project_id": record.project_id,
            "land_id": record.land_id,
            "possession_date": record.possession_date,
            "possession_status": record.possession_status,
            "remarks": record.remarks
        }
    }


@router.get("/")
def get_possession_records(
    db: Session = Depends(get_db)
):

    records = db.query(
        PossessionRecord
    ).order_by(
        PossessionRecord.id.desc()
    ).all()

    return {
        "count": len(records),
        "possession": [
            {
                "id": record.id,
                "project_id": record.project_id,
                "land_id": record.land_id,
                "possession_date": record.possession_date,
                "possession_status": record.possession_status,
                "remarks": record.remarks
            }
            for record in records
        ]
    }


@router.put("/{land_id}/status")
def update_possession_status(
    land_id: str,
    status: str,
    db: Session = Depends(get_db)
):

    record = db.query(
        PossessionRecord
    ).filter(
        PossessionRecord.land_id == land_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Possession record not found."
        )

    record.possession_status = status

    db.commit()
    db.refresh(record)

    return {
        "message": "Possession status updated successfully",
        "land_id": record.land_id,
        "status": record.possession_status
    }
