# Land Acquisition Management System

A full-stack application for managing land acquisition records, project workflows, possession, monitoring, GIS parcels, and route surveys.

## Features

- Land acquisition management and project workflow tracking
- Dashboard, monitoring, prediction, and possession management
- GIS parcel visualization with imported land records
- Leaflet-based interactive maps
- Route Survey with real road routes and corridor analysis
- FastAPI APIs backed by SQLAlchemy and SQLite
- Machine-learning prediction support

## Tech Stack

- **Backend:** Python, FastAPI, SQLAlchemy, SQLite, Uvicorn
- **Frontend:** React, Vite, React Router, Axios, Recharts
- **Mapping:** Leaflet and React Leaflet
- **Routing and map data:** OpenStreetMap and OSRM

## Folder Structure

```text
backend/       FastAPI app, database models, routes, services, and import scripts
dataset/       Source datasets
frontend/      React and Vite application
ml_model/      Machine-learning documentation and model assets
requirements.txt
package.json
```

## Backend Setup

Use Python 3.10 or newer. From the repository root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

The backend creates the SQLite schema when it starts. The database file is local and intentionally excluded from Git.

## Frontend Setup

Install frontend dependencies:

```powershell
cd frontend
npm install
```

## Run Locally

Open two terminals from the repository root.

Backend:

```powershell
uvicorn backend.main:app --reload
```

Frontend:

```powershell
cd frontend
npm run dev
```

The frontend normally runs at `http://localhost:5173` and the backend at `http://localhost:8000`.

## Route Survey

Route Survey sends the selected origin, destination, and corridor width to the FastAPI route-survey endpoint. The backend obtains road-network geometry and corridor information, and the frontend displays the result on the Leaflet map. Routes follow real roads rather than drawing a straight line between points.

## OpenStreetMap and OSRM

Leaflet displays map tiles from OpenStreetMap and credits the OpenStreetMap contributors. OSRM provides road-route geometry and route metrics for Route Survey. These public services require network access and are subject to their own availability and usage policies. This project does not store an API key for either service.

## GIS Parcel Data

The repository includes the supplied GIS land-record CSV files, including the 12 imported GIS parcel records. The source data remains tracked so a fresh local database can be recreated without committing a machine-specific SQLite file.

## Database Setup and Import

Start the backend once to create the local SQLite schema. After activating the virtual environment, import the land records from the repository root:

```powershell
python -m backend.data_import.import_land_records
```

The importer reads `backend/data_import/land_records.csv` and inserts or updates the parcel records. Additional seed and database utility scripts are available in `backend/` and `backend/database/` for their corresponding demo data.

SQLite database files, backups, and other local runtime artifacts are excluded by `.gitignore`.

## Production Build

```powershell
cd frontend
npm run build
```

The generated `frontend/dist/` directory is ignored and should not be committed.
