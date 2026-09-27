import sqlite3

DB_PATH = "land_acquisition.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS land_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    tehsil TEXT NOT NULL,
    village TEXT NOT NULL,
    lgd_district_code TEXT,
    lgd_subdistrict_code TEXT,
    lgd_village_code TEXT,
    source TEXT NOT NULL,
    last_verified TEXT
)
""")

conn.commit()

print("land_locations table ready.")

cursor.execute("""
SELECT name
FROM sqlite_master
WHERE type='table' AND name='land_locations'
""")

print("Table:", cursor.fetchone())

conn.close()
