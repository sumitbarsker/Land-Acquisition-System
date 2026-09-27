import sqlite3

DB_PATH = "land_acquisition.db"

updates = {
    "MP-BPL-001": ("Berasia", "Bhopal", "Demo Khasra 001"),
    "MP-BPL-002": ("Berasia", "Bhopal", "Demo Khasra 002"),
    "MP-SHR-001": ("Sehore", "Sehore", "Demo Khasra 001"),
    "MP-RSN-001": ("Raisen", "Raisen", "Demo Khasra 001"),
}

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

for land_id, (tehsil, village, khasra) in updates.items():
    cursor.execute("""
        UPDATE land_records
        SET tehsil = ?,
            village = ?,
            khasra_number = ?,
            record_source = 'Demo / Unverified'
        WHERE land_id = ?
    """, (tehsil, village, khasra, land_id))

conn.commit()

print("\nUpdated land records:\n")

rows = cursor.execute("""
    SELECT land_id, district, tehsil, village, khasra_number, record_source
    FROM land_records
    WHERE land_id IN (
        'MP-BPL-001',
        'MP-BPL-002',
        'MP-SHR-001',
        'MP-RSN-001'
    )
""").fetchall()

for row in rows:
    print(row)

conn.close()

print("\nDone.")
