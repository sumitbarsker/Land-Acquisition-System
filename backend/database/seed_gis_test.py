import sqlite3

DB_PATH = "land_acquisition.db"

coordinates = {
    "MP-BPL-001": (23.2599, 77.4126),
    "MP-BPL-002": (23.2300, 77.4300),
    "MP-SHR-001": (23.2000, 77.5000),
    "MP-RSN-001": (23.3300, 77.7800),
}

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

for land_id, (lat, lon) in coordinates.items():
    cursor.execute(
        """
        UPDATE land_records
        SET latitude = ?, longitude = ?
        WHERE land_id = ?
        """,
        (lat, lon, land_id)
    )

conn.commit()

print("GIS test coordinates updated.")

for row in cursor.execute(
    """
    SELECT land_id, district, latitude, longitude
    FROM land_records
    WHERE latitude IS NOT NULL
    """
):
    print(row)

conn.close()
