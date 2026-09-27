import csv
from pathlib import Path

from backend.database.database import SessionLocal
from backend.database.models import LandRecord


CSV_FILE = Path(__file__).parent / "land_records.csv"


def import_land_records():
    db = SessionLocal()

    try:
        with open(CSV_FILE, "r", encoding="utf-8-sig", newline="") as file:
            reader = csv.DictReader(file)

            required_columns = {
                "land_id",
                "district",
                "tehsil",
                "village",
                "khasra_number",
                "owner_name",
                "area_acres",
                "latitude",
                "longitude",
            }

            missing = required_columns - set(reader.fieldnames or [])

            if missing:
                raise ValueError(
                    f"Missing columns: {', '.join(sorted(missing))}"
                )

            imported = 0
            updated = 0

            for row in reader:
                land_id = row["land_id"].strip()

                existing = (
                    db.query(LandRecord)
                    .filter(LandRecord.land_id == land_id)
                    .first()
                )

                if existing:
                    record = existing
                    updated += 1
                else:
                    record = LandRecord(land_id=land_id)
                    db.add(record)
                    imported += 1

                record.district = row["district"].strip()
                record.tehsil = row["tehsil"].strip()
                record.village = row["village"].strip()
                record.khasra_number = row["khasra_number"].strip()
                record.owner_name = row["owner_name"].strip()

                record.area_acres = float(row["area_acres"])

                record.latitude = (
                    float(row["latitude"])
                    if row["latitude"].strip()
                    else None
                )

                record.longitude = (
                    float(row["longitude"])
                    if row["longitude"].strip()
                    else None
                )

                record.record_source = "Imported GIS / Open Data"

            db.commit()

            print(f"New records: {imported}")
            print(f"Updated records: {updated}")
            print("Import completed successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    import_land_records()
