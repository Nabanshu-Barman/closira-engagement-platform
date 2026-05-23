from typing import Literal

from pydantic import BaseModel, ConfigDict


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
    db: Literal["ok", "error"]

    model_config = ConfigDict(
        json_schema_extra={"example": {"status": "ok", "db": "ok"}}
    )
