from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime

from backend.database.database import get_db
from backend.database.models import PredictionHistory
from backend.ml.predict import predict_delay_risk


router = APIRouter(
    prefix="/predict",
    tags=["ML Prediction"]
)


class PredictionRequest(BaseModel):
    land_id: str = ""
    district: str
    area_acres: float
    land_value_lakh: float
    verification_status: str
    legal_dispute: int
    compensation_status: str
    pending_days: int
    document_completeness: int
    ownership_clarity: int
    current_stage: str


@router.post("/risk")
def predict_risk(
    data: PredictionRequest,
    db: Session = Depends(get_db)
):

    input_data = data.model_dump()

    result = predict_delay_risk(input_data)

    current_time = datetime.now().strftime(
        "%d %b %Y, %I:%M %p"
    )

    history = PredictionHistory(
        land_id=data.land_id,
        district=data.district,
        prediction=result["prediction"],
        risk=result["risk"],
        risk_probability=result["risk_probability"],
        created_at=current_time
    )

    db.add(history)
    db.commit()
    db.refresh(history)

    return {
        "message": "Delay risk predicted and saved successfully",
        "risk_prediction": result
    }


@router.get("/history")
def get_prediction_history(
    db: Session = Depends(get_db)
):

    history = (
        db.query(PredictionHistory)
        .order_by(PredictionHistory.id.desc())
        .all()
    )

    return {
        "total": len(history),
        "history": [
            {
                "id": item.id,
                "land_id": item.land_id,
                "district": item.district,
                "prediction": item.prediction,
                "risk": item.risk,
                "risk_probability": item.risk_probability,
                "created_at": item.created_at
            }
            for item in history
        ]
    }