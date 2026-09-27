from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database.database import engine
from backend.database.models import Base
from backend.routes.land import router as land_router
from backend.routes.dashboard import router as dashboard_router
from backend.routes.prediction import router as prediction_router
from backend.routes.projects import router as projects_router
from backend.routes.acquisition import router as acquisition_router
from backend.routes.possession import router as possession_router
from backend.routes.route_survey import router as route_survey_router


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(
    title="National Land Acquisition & Management System",
    description="Real-Time Land Acquisition Monitoring and Decision Support System",
    version="1.0.0"
)


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://localhost:5179",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:5176",
        "http://127.0.0.1:5177",
        "http://127.0.0.1:5178",
        "http://127.0.0.1:5179",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "National Land Acquisition & Management System is running",
        "status": "online"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# Register API routers
app.include_router(land_router)
app.include_router(dashboard_router)
app.include_router(prediction_router)
app.include_router(projects_router)
app.include_router(acquisition_router)
app.include_router(possession_router)
app.include_router(route_survey_router)
