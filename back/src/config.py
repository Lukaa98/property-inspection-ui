from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from pathlib import Path

# Get the project root (back/)
ROOT_DIR = Path(__file__).parent.parent

class Settings(BaseSettings):
    # OpenAI
    openai_api_key: str
    openai_model: str = "gpt-4o-mini"
    
    # CORS
    frontend_url: str = "http://localhost:3000"
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8081
    
    class Config:
        env_file = str(ROOT_DIR / ".env")
        case_sensitive = False

@lru_cache()
def get_settings():
    return Settings()