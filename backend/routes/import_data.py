from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend.database.models import LandRecord

router = APIRouter(prefix="/admin", tags=["Admin Import"])

IMPORT_KEY = "LandImport2026"

@router.post("/import")
def import_lands(data: list[dict], x_import_key: str = Header(default=""), db: Session = Depends(get_db)):
    if x_import_key != IMPORT_KEY:
        raise HTTPException(status_code=403, detail="Invalid import key")

    for item in data:
        existing = db.query(LandRecord).filter(
            LandRecord.land_id == item["land_id"]
        ).first()

        values = {
            key: item.get(key)
            for key in [
                "land_id", "district", "tehsil", "village", "khasra_number",
                "ownership_type", "area_acres", "owner_name", "status",
                "compensation_status", "progress", "current_stage",
                "pending_days", "risk_level", "land_value_lakh",
                "verification_status", "legal_dispute", "document_completeness",
                "ownership_clarity", "record_source", "source_reference",
                "last_verified", "mutation_status", "case_reference",
                "case_status", "land_type", "latitude", "longitude",
                "parcel_geometry"
            ]
        }

        if existing:
            for key, value in values.items():
                setattr(existing, key, value)
        else:
            db.add(LandRecord(**values))

    db.commit()

    return {
        "message": "Import successful",
        "imported": len(data),
        "total": db.query(LandRecord).count()
    }
