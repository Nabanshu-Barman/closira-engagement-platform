from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict

from app.utils.enums import FollowupStatusEnum


class FollowupCreate(BaseModel):
    delay_minutes: int = Field(..., ge=1, le=10080, examples=[30])
    template: str | None = Field(None, examples=["Checking in about your Breakout Escape Room booking."])

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "delay_minutes": 30,
                "template": "Checking in about your Breakout Escape Room booking.",
            }
        }
    )


class FollowupCreatedResponse(BaseModel):
    followup_id: UUID
    scheduled_for: datetime

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "followup_id": "5de5f2b3-42ed-4a46-a62a-1b042d6b41e7",
                "scheduled_for": "2026-05-23T12:30:00Z",
            }
        }
    )


class FollowupOut(BaseModel):
    id: UUID
    enquiry_id: UUID
    delay_minutes: int
    template: str | None
    status: FollowupStatusEnum
    scheduled_for: datetime | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
