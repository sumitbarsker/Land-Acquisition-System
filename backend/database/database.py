import os
import shutil
import sqlite3
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATABASE_PATH = os.path.join(BASE_DIR, "land_acquisition.db")
SEED_DATABASE_PATH = os.path.join(BASE_DIR, "backend", "land_acquisition_seed.db")

def seed_database():
    if not os.path.exists(SEED_DATABASE_PATH):
        return

    should_seed = not os.path.exists(DATABASE_PATH)

    if os.path.exists(DATABASE_PATH):
        try:
            conn = sqlite3.connect(DATABASE_PATH)
            tables = conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='land_records'"
            ).fetchone()

            if tables:
                count = conn.execute("SELECT COUNT(*) FROM land_records").fetchone()[0]
                should_seed = count == 0

            conn.close()
        except Exception:
            should_seed = True

    if should_seed:
        shutil.copy2(SEED_DATABASE_PATH, DATABASE_PATH)

seed_database()

DATABASE_URL = "sqlite:///" + DATABASE_PATH.replace("\\", "/")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
