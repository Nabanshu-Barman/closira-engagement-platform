from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.event import Event
from app.utils.enums import EventTypeEnum


async def create_event(
    session: AsyncSession,
    *,
    enquiry_id: UUID,
    event_type: EventTypeEnum,
    metadata: dict,
) -> Event:
    event = Event(enquiry_id=enquiry_id, event_type=event_type, meta=metadata)
    session.add(event)
    await session.flush()
    return event


async def list_events(session: AsyncSession, enquiry_id: UUID) -> list[Event]:
    result = await session.execute(
        select(Event).where(Event.enquiry_id == enquiry_id).order_by(Event.created_at.asc())
    )
    return list(result.scalars().all())
