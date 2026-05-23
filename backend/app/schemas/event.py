from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.utils.enums import EventTypeEnum


class EventOut(BaseModel):
    id: UUID
    enquiry_id: UUID
    event_type: EventTypeEnum
    metadata: dict = Field(validation_alias="meta")
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
