import math


def haversine_distance_km(
    lat1,
    lon1,
    lat2,
    lon2
):
    """
    Calculate great-circle distance between two coordinates.
    """

    earth_radius_km = 6371.0

    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)
    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    return earth_radius_km * c


def point_to_segment_distance_km(
    point_lat,
    point_lon,
    start_lat,
    start_lon,
    end_lat,
    end_lon
):
    """
    Approximate point-to-line-segment distance.

    Uses a local equirectangular projection which is
    sufficiently accurate for a city/regional route.
    """

    reference_lat = math.radians(
        (start_lat + end_lat) / 2
    )

    km_per_degree_lat = 111.32
    km_per_degree_lon = (
        111.32 * math.cos(reference_lat)
    )

    px = point_lon * km_per_degree_lon
    py = point_lat * km_per_degree_lat

    ax = start_lon * km_per_degree_lon
    ay = start_lat * km_per_degree_lat

    bx = end_lon * km_per_degree_lon
    by = end_lat * km_per_degree_lat

    abx = bx - ax
    aby = by - ay

    apx = px - ax
    apy = py - ay

    ab_squared = (
        abx * abx +
        aby * aby
    )

    if ab_squared == 0:
        return math.sqrt(
            (px - ax) ** 2 +
            (py - ay) ** 2
        )

    t = (
        apx * abx +
        apy * aby
    ) / ab_squared

    t = max(
        0,
        min(1, t)
    )

    closest_x = ax + t * abx
    closest_y = ay + t * aby

    return math.sqrt(
        (px - closest_x) ** 2 +
        (py - closest_y) ** 2
    )


def point_within_route_corridor(
    point_lat,
    point_lon,
    start_lat,
    start_lon,
    end_lat,
    end_lon,
    corridor_km
):
    """
    Backward-compatible straight-segment corridor check.

    This remains available for older routes.
    """

    distance_km = point_to_segment_distance_km(
        point_lat,
        point_lon,
        start_lat,
        start_lon,
        end_lat,
        end_lon
    )

    return (
        distance_km <= corridor_km,
        distance_km
    )


def point_to_route_distance_km(
    point_lat,
    point_lon,
    route_coordinates
):
    """
    Calculate minimum distance from a parcel point
    to the complete road route.

    route_coordinates format:

        [
            [longitude, latitude],
            [longitude, latitude],
            ...
        ]
    """

    if not route_coordinates:
        return None

    minimum_distance = float("inf")

    for index in range(
        len(route_coordinates) - 1
    ):

        lon1, lat1 = route_coordinates[index]
        lon2, lat2 = route_coordinates[index + 1]

        distance = point_to_segment_distance_km(
            point_lat,
            point_lon,
            lat1,
            lon1,
            lat2,
            lon2
        )

        if distance < minimum_distance:
            minimum_distance = distance

    if minimum_distance == float("inf"):
        return None

    return minimum_distance


def point_within_real_route_corridor(
    point_lat,
    point_lon,
    route_coordinates,
    corridor_km
):
    """
    Check whether a parcel lies inside the
    corridor around the actual road route.
    """

    distance_km = point_to_route_distance_km(
        point_lat,
        point_lon,
        route_coordinates
    )

    if distance_km is None:
        return False, None

    return (
        distance_km <= corridor_km,
        distance_km
    )
