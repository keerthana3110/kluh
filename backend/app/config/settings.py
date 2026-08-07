import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Sentinel AI Financial OS"
    VERSION: str = "2.0.0"
    ENV: str = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./sentinel.db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT Security
    SECRET_KEY: str = "sentinel_ai_super_secret_jwt_key_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # x402 Security
    X402_SECRET: str = "x402_sec_99a8b7c6d5e4f3a2b1_sentinel_gov"

    # Algorand Blockchain
    ALGORAND_NODE_URL: str = "https://mainnet-api.algonode.cloud"
    ALGORAND_GOVERNANCE_APP_ID: int = 1049283
    ALGORAND_SENDER_ADDR: str = "SENTINEL_GOV_ALGO_ADDR_89234X9123847"

    # AI Provider Key Pools (Comma Separated strings)
    GEMINI_KEYS: str = "gemini_key_1,gemini_key_2,gemini_key_3,gemini_key_4,gemini_key_5"
    GROK_KEYS: str = "grok_key_1,grok_key_2,grok_key_3,grok_key_4,grok_key_5"
    OPENROUTER_KEYS: str = "or_key_1,or_key_2,or_key_3,or_key_4,or_key_5"
    OLLAMA_URL: str = "http://localhost:11434"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def gemini_key_list(self) -> List[str]:
        return [k.strip() for k in self.GEMINI_KEYS.split(",") if k.strip()]

    @property
    def grok_key_list(self) -> List[str]:
        return [k.strip() for k in self.GROK_KEYS.split(",") if k.strip()]

    @property
    def openrouter_key_list(self) -> List[str]:
        return [k.strip() for k in self.OPENROUTER_KEYS.split(",") if k.strip()]


settings = Settings()
