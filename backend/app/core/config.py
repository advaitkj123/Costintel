from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Cloud Cost Intelligence System"
    API_V1_STR: str = "/api/v1"
    
    # DATABASE
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/cloud_costs"
    
    # AWS
    AWS_ACCESS_KEY_ID: str | None = None
    AWS_SECRET_ACCESS_KEY: str | None = None
    AWS_DEFAULT_REGION: str = "us-east-1"
    
    # AUTH
    SECRET_KEY: str = "supersecretkeyforcloudcostintel"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    class Config:
        env_file = ".env"

settings = Settings()
