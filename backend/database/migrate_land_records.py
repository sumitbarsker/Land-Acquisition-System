import sqlite3

DB_PATH = "land_acquisition.db"

columns = {
    "record_source": "TEXT DEFAULT 'Demo / Unverified'",
    "source_reference": "TEXT",
    "last_verified": "TEXT",
    "mutation_status": "TEXT",
    "case_reference": "TEXT",
    "case_status": "TEXT",
    "land_type": "TEXT",
    "latitude": "REAL",
    "longitude": "REAL",
    "parcel_geometry": "TEXT"
}

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

existing = {
    row[1]
    for row in cursor.execute("PRAGMA table_info(land_records)")
}

for column, definition in columns.items():
    if column not in existing:
        cursor.execute(
            f"ALTER TABLE land_records ADD COLUMN {column} {definition}"
        )
        print(f"Added: {column}")
    else:
        print(f"Already exists: {column}")

conn.commit()
conn.close()

print("Land records migration completed.")
