from sqlalchemy import Column, Integer, String, Float, Text
from backend.database.database import Base


class LandRecord(Base):
    __tablename__ = "land_records"

    id = Column(Integer, primary_key=True, index=True)

    land_id = Column(String, unique=True, index=True)

    district = Column(String)

    tehsil = Column(String, nullable=True)

    village = Column(String, nullable=True)

    khasra_number = Column(String, nullable=True)

    ownership_type = Column(String, default="Individual")

    area_acres = Column(Float)

    owner_name = Column(String)

    status = Column(String)

    compensation_status = Column(String)

    # Monitoring fields
    progress = Column(Integer, default=0)

    current_stage = Column(
        String,
        default="Verification"
    )

    pending_days = Column(
        Integer,
        default=0
    )

    risk_level = Column(
        String,
        default="Low"
    )

    # AI Prediction fields
    land_value_lakh = Column(
        Float,
        default=30
    )

    verification_status = Column(
        String,
        default="Clear"
    )

    legal_dispute = Column(
        Integer,
        default=0
    )

    document_completeness = Column(
        Integer,
        default=80
    )

    ownership_clarity = Column(
        Integer,
        default=80
    )



    # ==========================================
    # OFFICIAL LAND RECORD VERIFICATION
    # ==========================================

    record_source = Column(String, default="Open Government Data")

    source_reference = Column(
        String,
        nullable=True
    )

    last_verified = Column(
        String,
        nullable=True
    )

    mutation_status = Column(
        String,
        nullable=True
    )

    case_reference = Column(
        String,
        nullable=True
    )

    case_status = Column(
        String,
        nullable=True
    )

    land_type = Column(
        String,
        nullable=True
    )

    latitude = Column(
        Float,
        nullable=True
    )

    longitude = Column(
        Float,
        nullable=True
    )

    parcel_geometry = Column(
        Text,
        nullable=True
    )

class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    land_id = Column(String)

    district = Column(String)

    prediction = Column(Integer)

    risk = Column(String)

    risk_probability = Column(Float)

    created_at = Column(
        String,
        default=lambda: __import__("datetime").datetime.now().strftime(
            "%d %b %Y, %I:%M %p"
        )
    )


# ==========================================
# PROJECT & PROPOSAL MANAGEMENT
# ==========================================

class ProjectProposal(Base):
    __tablename__ = "project_proposals"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    project_id = Column(
        String,
        unique=True,
        index=True
    )

    project_name = Column(String)

    state = Column(String)

    district = Column(String)

    implementing_agency = Column(String)

    land_proposed = Column(
        Float,
        default=0
    )

    land_acquired = Column(
        Float,
        default=0
    )

    proposal_status = Column(
        String,
        default="Submitted"
    )

    current_stage = Column(
        String,
        default="Proposal Submission"
    )

    submission_date = Column(String)

    approval_date = Column(
        String,
        nullable=True
    )


# ==========================================
# ACQUISITION NOTIFICATION MANAGEMENT
# ==========================================

class AcquisitionNotification(Base):

    __tablename__ = "acquisition_notifications"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    project_id = Column(
        String,
        index=True
    )

    notification_number = Column(String)

    notification_type = Column(String)

    notification_date = Column(String)

    affected_land = Column(
        Float,
        default=0
    )

    status = Column(
        String,
        default="Issued"
    )


# ==========================================
# LAND AWARD MANAGEMENT
# ==========================================

class LandAward(Base):

    __tablename__ = "land_awards"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    project_id = Column(
        String,
        index=True
    )

    award_number = Column(String)

    award_date = Column(String)

    affected_land = Column(
        Float,
        default=0
    )

    compensation_amount = Column(
        Float,
        default=0
    )

    status = Column(
        String,
        default="Declared"
    )


# ==========================================
# COMPENSATION MANAGEMENT
# ==========================================

class Compensation(Base):

    __tablename__ = "compensation"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    project_id = Column(
        String,
        index=True
    )

    land_id = Column(
        String,
        index=True
    )

    owner_name = Column(String)

    assessed_amount = Column(
        Float,
        default=0
    )

    disbursed_amount = Column(
        Float,
        default=0
    )

    payment_date = Column(
        String,
        nullable=True
    )

    payment_status = Column(
        String,
        default="Pending"
    )
    # ==========================================
# POSSESSION MANAGEMENT
# ==========================================

class PossessionRecord(Base):
    __tablename__ = "possession_records"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(String, index=True)
    land_id = Column(String, index=True)

    possession_date = Column(String, nullable=True)

    possession_status = Column(
        String,
        default="Pending"
    )

    remarks = Column(
        String,
        nullable=True
    )


