from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "closira-enquiry-backend"
    environment: str = "local"
    log_level: str = "INFO"

    database_url: str
    database_url_sync: str

    redis_url: str = "redis://localhost:6379/0"

    model_config = SettingsConfigDict(env_file=".env", env_prefix="", extra="ignore")


settings = Settings()
