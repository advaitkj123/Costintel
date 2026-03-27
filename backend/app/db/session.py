from typing import Any
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import get_settings

settings = get_settings()

engine_args: dict[str, Any] = {
    "pool_pre_ping": True,
    "future": True,
}

if settings.database_url.startswith("sqlite"):
    engine_args["connect_args"] = {"check_same_thread": False}

engine = create_engine(
    settings.database_url,
    **engine_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)
