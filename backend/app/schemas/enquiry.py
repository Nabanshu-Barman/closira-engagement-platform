from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict

from app.schemas.event import EventOut
from app.schemas.followup import FollowupOut
from app.utils.enums import ChannelEnum, EnquiryStatusEnum


class EnquiryCreate(BaseModel):
    channel: ChannelEnum = Field(..., examples=["whatsapp"])
    customer_name: str = Field(..., min_length=1, max_length=200, examples=["Ava Patel"])
    message: str = Field(
        ..., min_length=1, examples=["Whats the price for 6 players this Saturday at Breakout Escape Room?"]
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "channel": "whatsapp",
                "customer_name": "Ava Patel",
                "message": "Whats the price for 6 players this Saturday at Breakout Escape Room?",
            }
        }
    )


class EnquiryCreatedResponse(BaseModel):
    enquiry_id: UUID
    status: Literal["queued"] = "queued"

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "enquiry_id": "2b2d7e26-8c5a-4b3f-8a79-7f3c1d7f0f9a",
                "status": "queued",
            }
        }
    )


class EnquiryEscalateRequest(BaseModel):
    reason: str = Field(..., min_length=1, examples=["Customer requested a refund for a cancelled booking."])

    model_config = ConfigDict(
        json_schema_extra={
            "example": {"reason": "Customer requested a refund for a cancelled booking."}
        }
    )


class EnquiryEscalateResponse(BaseModel):
    enquiry_id: UUID
    status: Literal["escalated"] = "escalated"

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "enquiry_id": "2b2d7e26-8c5a-4b3f-8a79-7f3c1d7f0f9a",
                "status": "escalated",
            }
        }
    )


class EnquiryOut(BaseModel):
    id: UUID
    channel: ChannelEnum
    customer_name: str
    message: str
    status: EnquiryStatusEnum
    matched_sop: str | None
    suggested_response: str | None
    escalation_reason: str | None
    created_at: datetime
    updated_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class EnquiryHistoryResponse(BaseModel):
    enquiry: EnquiryOut
    events: list[EventOut]
    followups: list[FollowupOut]
