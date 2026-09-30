from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime

from backend.database.database import get_db
from backend.database.models import ProjectProposal


router = APIRouter(
    prefix="/projects",
    tags=["Project Proposals"]
)


class ProjectProposalRequest(BaseModel):
    project_id: str
    project_name: str
    state: str
    district: str
    implementing_agency: str
    land_proposed: float
    land_acquired: float = 0
    proposal_status: str = "Submitted"
    current_stage: str = "Proposal Submission"


class ProjectStatusUpdate(BaseModel):
    proposal_status: str
    current_stage: str


@router.post("/")
def create_project(
    data: ProjectProposalRequest,
    db: Session = Depends(get_db)
):

    existing_project = db.query(ProjectProposal).filter(
        ProjectProposal.project_id == data.project_id
    ).first()

    if existing_project:
        raise HTTPException(
            status_code=400,
            detail="Project ID already exists"
        )

    new_project = ProjectProposal(
        project_id=data.project_id,
        project_name=data.project_name,
        state=data.state,
        district=data.district,
        implementing_agency=data.implementing_agency,
        land_proposed=data.land_proposed,
        land_acquired=data.land_acquired,
        proposal_status=data.proposal_status,
        current_stage=data.current_stage,
        submission_date=datetime.now().strftime(
            "%d %b %Y, %I:%M %p"
        )
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return {
        "message": "Project proposal submitted successfully",
        "project": {
            "project_id": new_project.project_id,
            "project_name": new_project.project_name,
            "state": new_project.state,
            "district": new_project.district,
            "implementing_agency": new_project.implementing_agency,
            "land_proposed": new_project.land_proposed,
            "land_acquired": new_project.land_acquired,
            "proposal_status": new_project.proposal_status,
            "current_stage": new_project.current_stage,
            "submission_date": new_project.submission_date,
            "approval_date": new_project.approval_date
        }
    }


@router.get("/")
def get_projects(
    db: Session = Depends(get_db)
):

    projects = (
        db.query(ProjectProposal)
        .order_by(ProjectProposal.id.desc())
        .all()
    )

    return {
        "total": len(projects),
        "projects": [
            {
                "project_id": project.project_id,
                "project_name": project.project_name,
                "state": project.state,
                "district": project.district,
                "implementing_agency": project.implementing_agency,
                "land_proposed": project.land_proposed,
                "land_acquired": project.land_acquired,
                "proposal_status": project.proposal_status,
                "current_stage": project.current_stage,
                "submission_date": project.submission_date,
                "approval_date": project.approval_date
            }
            for project in projects
        ]
    }


@router.put("/{project_id}/status")
def update_project_status(
    project_id: str,
    data: ProjectStatusUpdate,
    db: Session = Depends(get_db)
):

    project = db.query(ProjectProposal).filter(
        ProjectProposal.project_id == project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    project.proposal_status = data.proposal_status
    project.current_stage = data.current_stage

    if data.proposal_status == "Approved":
        project.approval_date = datetime.now().strftime(
            "%d %b %Y, %I:%M %p"
        )

    db.commit()
    db.refresh(project)

    return {
        "message": "Project status updated successfully",
        "project": {
            "project_id": project.project_id,
            "project_name": project.project_name,
            "proposal_status": project.proposal_status,
            "current_stage": project.current_stage,
            "approval_date": project.approval_date
        }
    }
