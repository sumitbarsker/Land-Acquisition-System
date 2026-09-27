import sqlite3

DB_PATH = "land_acquisition.db"

locations = [
    (
        "Madhya Pradesh",
        "Bhopal",
        "Berasia",
        "Bhopal",
        None,
        None,
        None,
        "LGD - Administrative Master",
        "2026-09-27"
    ),
    (
        "Madhya Pradesh",
        "Raisen",
        "Raisen",
        "Raisen",
        None,
        None,
        None,
        "LGD - Administrative Master",
        "2026-09-27"
    ),
    (
        "Madhya Pradesh",
        "Sehore",
        "Sehore",
        "Sehore",
        None,
        None,
        None,
        "LGD - Administrative Master",
        "2026-09-27"
    )
]

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.executemany("""
INSERT INTO land_locations (
    state,
    district,
    tehsil,
    village,
    lgd_district_code,
    lgd_subdistrict_code,
    lgd_village_code,
    source,
    last_verified
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
""", locations)

conn.commit()

print("Location master records inserted.")

for row in cursor.execute("""
    SELECT state, district, tehsil, village, source
    FROM land_locations
"""):
    print(row)

conn.close()
