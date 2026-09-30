from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime

from backend.database.database import get_db
from backend.database.models import (
    AcquisitionNotification,
    LandAward,
    Compensation,
)


router = APIRouter(
    tags=["Acquisition Management"]
)


# ==========================================
# NOTIFICATION SCHEMAS
# ==========================================

class NotificationRequest(BaseModel):
    project_id: str
    notification_number: str
    notification_type: str
    affected_land: float


# ==========================================
# AWARD SCHEMAS
# ==========================================

class AwardRequest(BaseModel):
    project_id: str
    award_number: str
    affected_land: float
    compensation_amount: float


# ==========================================
# COMPENSATION SCHEMAS
# ==========================================

class CompensationRequest(BaseModel):
    project_id: str
    land_id: str
    owner_name: str
    assessed_amount: float


class PaymentUpdate(BaseModel):
    disbursed_amount: float


# ==========================================
# NOTIFICATION APIs
# ==========================================

@router.post("/notifications/")
def create_notification(
    data: NotificationRequest,
    db: Session = Depends(get_db)
):

    notification = AcquisitionNotification(

        project_id=data.project_id,

        notification_number=data.notification_number,

        notification_type=data.notification_type,

        notification_date=datetime.now().strftime(
            "%d %b %Y, %I:%M %p"
        ),

        affected_land=data.affected_land,

        status="Issued"
    )

    db.add(notification)

    db.commit()

    db.refresh(notification)

    return {
        "message": "Acquisition notification issued successfully",

        "notification": {
            "id": notification.id,
            "project_id": notification.project_id,
            "notification_number": notification.notification_number,
            "notification_type": notification.notification_type,
            "notification_date": notification.notification_date,
            "affected_land": notification.affected_land,
            "status": notification.status
        }
    }


@router.get("/notifications/")
def get_notifications(
    db: Session = Depends(get_db)
):

    notifications = (
        db.query(AcquisitionNotification)
        .order_by(
            AcquisitionNotification.id.desc()
        )
        .all()
    )

    return {
        "total": len(notifications),

        "notifications": [
            {
                "id": notification.id,
                "project_id": notification.project_id,
                "notification_number": notification.notification_number,
                "notification_type": notification.notification_type,
                "notification_date": notification.notification_date,
                "affected_land": notification.affected_land,
                "status": notification.status
            }

            for notification in notifications
        ]
    }


# ==========================================
# AWARD APIs
# ==========================================

@router.post("/awards/")
def create_award(
    data: AwardRequest,
    db: Session = Depends(get_db)
):

    award = LandAward(

        project_id=data.project_id,

        award_number=data.award_number,

        award_date=datetime.now().strftime(
            "%d %b %Y, %I:%M %p"
        ),

        affected_land=data.affected_land,

        compensation_amount=data.compensation_amount,

        status="Declared"
    )

    db.add(award)

    db.commit()

    db.refresh(award)

    return {
        "message": "Land acquisition award declared successfully",

        "award": {
            "id": award.id,
            "project_id": award.project_id,
            "award_number": award.award_number,
            "award_date": award.award_date,
            "affected_land": award.affected_land,
            "compensation_amount": award.compensation_amount,
            "status": award.status
        }
    }


@router.get("/awards/")
def get_awards(
    db: Session = Depends(get_db)
):

    awards = (
        db.query(LandAward)
        .order_by(
            LandAward.id.desc()
        )
        .all()
    )

    return {
        "total": len(awards),

        "awards": [
            {
                "id": award.id,
                "project_id": award.project_id,
                "award_number": award.award_number,
                "award_date": award.award_date,
                "affected_land": award.affected_land,
                "compensation_amount": award.compensation_amount,
                "status": award.status
            }

            for award in awards
        ]
    }


# ==========================================
# COMPENSATION APIs
# ==========================================

@router.post("/compensation/")
def create_compensation(
    data: CompensationRequest,
    db: Session = Depends(get_db)
):

    existing = (
        db.query(Compensation)
        .filter(
            Compensation.land_id == data.land_id
        )
        .first()
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Compensation record already exists for this land"
        )


    compensation = Compensation(

        project_id=data.project_id,

        land_id=data.land_id,

        owner_name=data.owner_name,

        assessed_amount=data.assessed_amount,

        disbursed_amount=0,

        payment_date=None,

        payment_status="Pending"
    )

    db.add(compensation)

    db.commit()

    db.refresh(compensation)

    return {
        "message": "Compensation record created successfully",

        "compensation": {
            "id": compensation.id,
            "project_id": compensation.project_id,
            "land_id": compensation.land_id,
            "owner_name": compensation.owner_name,
            "assessed_amount": compensation.assessed_amount,
            "disbursed_amount": compensation.disbursed_amount,
            "payment_status": compensation.payment_status
        }
    }


@router.get("/compensation/")
def get_compensation(
    db: Session = Depends(get_db)
):

    records = (
        db.query(Compensation)
        .order_by(
            Compensation.id.desc()
        )
        .all()
    )

    return {
        "total": len(records),

        "compensation": [
            {
                "id": record.id,
                "project_id": record.project_id,
                "land_id": record.land_id,
                "owner_name": record.owner_name,
                "assessed_amount": record.assessed_amount,
                "disbursed_amount": record.disbursed_amount,
                "payment_date": record.payment_date,
                "payment_status": record.payment_status
            }

            for record in records
        ]
    }


@router.put("/compensation/{land_id}/payment")
def update_payment(
    land_id: str,
    data: PaymentUpdate,
    db: Session = Depends(get_db)
):

    compensation = (
        db.query(Compensation)
        .filter(
            Compensation.land_id == land_id
        )
        .first()
    )

    if not compensation:

        raise HTTPException(
            status_code=404,
            detail="Compensation record not found"
        )


    if data.disbursed_amount < 0:

        raise HTTPException(
            status_code=400,
            detail="Disbursed amount cannot be negative"
        )


    if data.disbursed_amount > compensation.assessed_amount:

        raise HTTPException(
            status_code=400,
            detail="Disbursed amount cannot exceed assessed amount"
        )


    compensation.disbursed_amount = data.disbursed_amount

    compensation.payment_date = datetime.now().strftime(
        "%d %b %Y, %I:%M %p"
    )


    if data.disbursed_amount >= compensation.assessed_amount:

        compensation.payment_status = "Paid"

    elif data.disbursed_amount > 0:

        compensation.payment_status = "Partially Paid"

    else:

        compensation.payment_status = "Pending"


    db.commit()

    db.refresh(compensation)


    return {
        "message": "Compensation payment updated successfully",

        "compensation": {
            "land_id": compensation.land_id,
            "owner_name": compensation.owner_name,
            "assessed_amount": compensation.assessed_amount,
            "disbursed_amount": compensation.disbursed_amount,
            "payment_date": compensation.payment_date,
            "payment_status": compensation.payment_status
        }
    }
