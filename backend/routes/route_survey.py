from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.database.models import LandRecord
from backend.services.gis_service import point_within_real_route_corridor

import json
import urllib.request
import urllib.parse


router = APIRouter(
    prefix="/route-survey",
    tags=["Route Survey"]
)


ROUTE_POINTS = {
    "Bhopal": (23.2599, 77.4126),
    "Raisen": (23.3315, 77.7819),
}


def get_real_road_route(start_point, end_point):
    """
    Get actual road route from OSRM using OpenStreetMap road data.

    Returns:
        {
            "coordinates": [[lon, lat], ...],
            "distance_km": float,
            "duration_min": float
        }

    Returns None if OSRM is unavailable.
    """

    start_lat, start_lon = start_point
    end_lat, end_lon = end_point

    url = (
        "https://router.project-osrm.org/route/v1/driving/"
        f"{start_lon},{start_lat};{end_lon},{end_lat}"
        "?overview=full&geometries=geojson"
    )

    try:
        request = urllib.request.Request(
            url,
            headers={
                "User-Agent": "LandGuard-National-Land-Acquisition-System"
            }
        )

        with urllib.request.urlopen(request, timeout=15) as response:
            data = json.loads(response.read().decode("utf-8"))

        if data.get("code") != "Ok":
            return None

        route = data["routes"][0]

        return {
            "coordinates": route["geometry"]["coordinates"],
            "distance_km": round(route["distance"] / 1000, 2),
            "duration_min": round(route["duration"] / 60, 1),
        }

    except Exception as error:
        print("OSRM route error:", error)
        return None


@router.get("/corridor")
def analyze_corridor(
    start: str = "Bhopal",
    end: str = "Raisen",
    corridor_km: float = 5.0,
    db: Session = Depends(get_db)
):

    start = start.strip()
    end = end.strip()

    start_point = ROUTE_POINTS.get(start)
    end_point = ROUTE_POINTS.get(end)

    if not start_point or not end_point:
        return {
            "error": "Route endpoint coordinates are not configured.",
            "start": start,
            "end": end
        }

    # ---------------------------------------------------------
    # REAL ROAD ROUTE
    # ---------------------------------------------------------

    real_route = get_real_road_route(
        start_point,
        end_point
    )

    # ---------------------------------------------------------
    # LAND DATABASE
    # ---------------------------------------------------------

    lands = db.query(LandRecord).filter(
        LandRecord.latitude.isnot(None),
        LandRecord.longitude.isnot(None)
    ).all()

    results = []

    for land in lands:

        within_corridor, distance_km = point_within_real_route_corridor(land.latitude, land.longitude, real_route["coordinates"] if real_route else [], corridor_km)

        if not within_corridor:
            continue

        results.append({
            "land_id": land.land_id,
            "owner_name": land.owner_name,
            "khasra_number": land.khasra_number,
            "village": land.village,
            "tehsil": land.tehsil,
            "district": land.district,
            "area_acres": land.area_acres,
            "ownership_type": land.ownership_type,
            "acquisition_status": land.status,
            "compensation_status": land.compensation_status,
            "legal_dispute": land.legal_dispute,
            "verification_status": land.verification_status,

            "record_source": land.record_source,
            "source_reference": land.source_reference,
            "last_verified": land.last_verified,
            "mutation_status": land.mutation_status,
            "case_reference": land.case_reference,
            "case_status": land.case_status,
            "land_type": land.land_type,

            "latitude": land.latitude,
            "longitude": land.longitude,
            "parcel_geometry": land.parcel_geometry,

            "distance_from_route_km": round(
                distance_km,
                3
            )
        })

    # ---------------------------------------------------------
    # SUMMARY
    # ---------------------------------------------------------

    total_area = sum(
        land["area_acres"] or 0
        for land in results
    )

    disputed_count = sum(
        1
        for land in results
        if land["legal_dispute"] == 1
    )

    acquired_count = sum(
        1
        for land in results
        if land["acquisition_status"] == "Acquired"
    )

    pending_compensation_count = sum(
        1
        for land in results
        if land["compensation_status"] == "Pending"
    )

    average_distance = (
        sum(
            land["distance_from_route_km"]
            for land in results
        ) / len(results)
        if results
        else 0
    )

    # ---------------------------------------------------------
    # RESPONSE
    # ---------------------------------------------------------

    return {
        "route": {
            "start": start,
            "end": end,
            "corridor_km": corridor_km,

            "geometry": (
                real_route
                if real_route
                else None
            ),

            "route_source": (
                "OSRM / OpenStreetMap"
                if real_route
                else "Unavailable"
            ),

            "road_distance_km": (
                real_route["distance_km"]
                if real_route
                else None
            ),

            "estimated_duration_min": (
                real_route["duration_min"]
                if real_route
                else None
            )
        },

        "summary": {
            "total_affected_parcels": len(results),
            "total_affected_area_acres": round(
                total_area,
                2
            ),
            "disputed_parcels": disputed_count,
            "acquired_parcels": acquired_count,
            "pending_compensation": pending_compensation_count,
            "average_distance_from_route_km": round(
                average_distance,
                3
            )
        },

        "parcels": results
    }


