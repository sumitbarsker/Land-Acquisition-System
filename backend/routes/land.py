from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.database.models import LandRecord


router = APIRouter(prefix="/lands", tags=["Land Records"])


class Land(BaseModel):
    land_id: str
    district: str
    tehsil: str = ""
    village: str = ""
    khasra_number: str = ""
    ownership_type: str = "Individual"
    area_acres: float
    owner_name: str
    status: str
    compensation_status: str


# Add new land record
@router.post("/")
def add_land(land: Land, db: Session = Depends(get_db)):

    existing_land = db.query(LandRecord).filter(
        LandRecord.land_id == land.land_id
    ).first()

    if existing_land:
        raise HTTPException(
            status_code=400,
            detail="Land ID already exists"
        )

    new_land = LandRecord(
        land_id=land.land_id,
        district=land.district,
        tehsil=land.tehsil,
        village=land.village,
        khasra_number=land.khasra_number,
        ownership_type=land.ownership_type,
        area_acres=land.area_acres,
        owner_name=land.owner_name,
        status=land.status,
        compensation_status=land.compensation_status,

        progress=0,
        current_stage="Verification",
        pending_days=0,
        risk_level="Low",

        land_value_lakh=30,
        verification_status="Clear",
        legal_dispute=0,
        document_completeness=80,
        ownership_clarity=80
    )

    db.add(new_land)
    db.commit()
    db.refresh(new_land)

    return {
        "message": "Land record added successfully",
        "land": {
            "land_id": new_land.land_id,
            "district": new_land.district,
            "tehsil": new_land.tehsil,
            "village": new_land.village,
            "khasra_number": new_land.khasra_number,
            "ownership_type": new_land.ownership_type,
            "area_acres": new_land.area_acres,
            "owner_name": new_land.owner_name,
            "status": new_land.status,
            "compensation_status": new_land.compensation_status,

            "progress": new_land.progress,
            "current_stage": new_land.current_stage,
            "pending_days": new_land.pending_days,
            "risk_level": new_land.risk_level,

            "land_value_lakh": new_land.land_value_lakh,
            "verification_status": new_land.verification_status,
            "legal_dispute": new_land.legal_dispute,
            "document_completeness": new_land.document_completeness,
            "ownership_clarity": new_land.ownership_clarity
        }
    }


# Get all land records
@router.get("/")
def get_lands(db: Session = Depends(get_db)):

    lands = db.query(LandRecord).all()

    return {
        "total": len(lands),
        "lands": [
            {
                "land_id": land.land_id,
                "district": land.district,
                "tehsil": land.tehsil,
                "village": land.village,
                "khasra_number": land.khasra_number,
                "ownership_type": land.ownership_type,
                "area_acres": land.area_acres,
                "owner_name": land.owner_name,
                "status": land.status,
                "compensation_status": land.compensation_status,

                "progress": land.progress,
                "current_stage": land.current_stage,
                "pending_days": land.pending_days,
                "risk_level": land.risk_level,

                "land_value_lakh": land.land_value_lakh,
                "verification_status": land.verification_status,
                "legal_dispute": land.legal_dispute,
                "document_completeness": land.document_completeness,
                "ownership_clarity": land.ownership_clarity
            }
            for land in lands
        ]
    }


# Real-time monitoring data
@router.get("/monitoring")
def get_monitoring_data(db: Session = Depends(get_db)):

    lands = db.query(LandRecord).all()

    monitoring = []

    for land in lands:

        monitoring.append({
            "id": land.land_id,
            "district": land.district,
            "progress": land.progress,
            "stage": land.current_stage,
            "days": land.pending_days,
            "risk": land.risk_level
        })

    return {
        "total": len(monitoring),
        "monitoring": monitoring
    }


# Land acquisition alerts
@router.get("/alerts")
def get_land_alerts(db: Session = Depends(get_db)):

    lands = db.query(LandRecord).all()

    alerts = []

    for land in lands:

        if land.risk_level == "High":

            alerts.append({
                "id": land.land_id,
                "district": land.district,
                "type": "High Risk",
                "message": "Land acquisition case requires immediate attention.",
                "days": land.pending_days,
                "risk": land.risk_level
            })

        elif land.pending_days >= 20:

            alerts.append({
                "id": land.land_id,
                "district": land.district,
                "type": "Delayed Case",
                "message": "Land acquisition process has been pending for a long time.",
                "days": land.pending_days,
                "risk": land.risk_level
            })

    return {
        "total": len(alerts),
        "alerts": alerts
    }

