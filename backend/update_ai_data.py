import sqlite3


conn = sqlite3.connect("land_acquisition.db")
cursor = conn.cursor()


updates = {

    "MP-BPL-001": (
        30,
        "Clear",
        0,
        72,
        68
    ),

    "MP-BPL-002": (
        45,
        "Clear",
        0,
        96,
        94
    ),

    "MP-SHR-001": (
        28,
        "Pending",
        1,
        65,
        58
    ),

    "MP-RSN-001": (
        38,
        "Clear",
        0,
        92,
        90
    ),

    "MP-IND-001": (
        55,
        "Clear",
        0,
        78,
        82
    ),

    "MP-JBL-001": (
        42,
        "Clear",
        0,
        95,
        93
    ),

    "MP-VID-001": (
        32,
        "Pending",
        0,
        74,
        76
    ),

    "MP-HOS-001": (
        26,
        "Disputed",
        1,
        61,
        55
    ),

    "MP-RAJ-001": (
        24,
        "Clear",
        0,
        94,
        91
    ),

    "MP-BET-001": (
        35,
        "Pending",
        0,
        70,
        73
    ),
}


for land_id, values in updates.items():

    cursor.execute(
        """
        UPDATE land_records
        SET
            land_value_lakh = ?,
            verification_status = ?,
            legal_dispute = ?,
            document_completeness = ?,
            ownership_clarity = ?
        WHERE land_id = ?
        """,
        (
            values[0],
            values[1],
            values[2],
            values[3],
            values[4],
            land_id
        )
    )


conn.commit()
conn.close()


print("AI data updated successfully!")
print("Total records updated:", len(updates))
