from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers import cost, anomalies, auth
from app.core.database import engine, Base
from app.models.user import User  # Ensure User table is created

# Create tables if not exist (Only for dev, use Alembic in prod)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cost.router, prefix=settings.API_V1_STR)
app.include_router(anomalies.router, prefix=settings.API_V1_STR)
app.include_router(auth.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "Welcome to the Cloud Cost Intelligence System API"}
