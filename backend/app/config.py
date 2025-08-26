import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./books.db")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")

settings = Settings()