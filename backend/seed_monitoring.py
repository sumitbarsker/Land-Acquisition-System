import sqlite3


DATABASE = "land_acquisition.db"


monitoring_data = [
    ("MP-BPL-001", 65, "Verification", 12, "Medium"),
    ("MP-BPL-002", 100, "Completed", 0, "Low"),
    ("MP-SHR-001", 35, "Dispute Resolution", 28, "High"),
    ("MP-RSN-001", 100, "Completed", 0, "Low"),
    ("MP-IND-001", 58, "Compensation", 18, "Medium"),
    ("MP-JBL-001", 100, "Completed", 0, "Low"),
    ("MP-VID-001", 48, "Verification", 15, "Medium"),
    ("MP-HOS-001", 30, "Dispute Resolution", 31, "High"),
    ("MP-RAJ-001", 100, "Completed", 0, "Low"),
    ("MP-BET-001", 52, "Verification", 20, "Medium"),
]


db = sqlite3.connect(DATABASE)
cursor = db.cursor()


for land_id, progress, stage, pending_days, risk in monitoring_data:

    cursor.execute(
        """
        UPDATE land_records
        SET
            progress = ?,
            current_stage = ?,
            pending_days = ?,
            risk_level = ?
        WHERE land_id = ?
        """,
        (
            progress,
            stage,
            pending_days,
            risk,
            land_id,
        ),
    )


db.commit()
db.close()


print("Monitoring data updated successfully.")
