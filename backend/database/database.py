import os
import shutil
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATABASE_PATH = os.path.join(BASE_DIR, "land_acquisition.db")
SEED_DATABASE_PATH = os.path.join(BASE_DIR, "land_acquisition_seed.db")

if not os.path.exists(DATABASE_PATH) and os.path.exists(SEED_DATABASE_PATH):
    shutil.copy2(SEED_DATABASE_PATH, DATABASE_PATH)

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
