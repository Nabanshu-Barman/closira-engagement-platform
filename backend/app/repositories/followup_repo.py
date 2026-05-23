from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.followup import Followup


async def create_followup(session: AsyncSession, followup: Followup) -> Followup:
    session.add(followup)
    await session.flush()
    return followup


async def list_followups(session: AsyncSession, enquiry_id: UUID) -> list[Followup]:
    result = await session.execute(
        select(Followup)
        .where(Followup.enquiry_id == enquiry_id)
        .order_by(Followup.created_at.asc())
    )
    return list(result.scalars().all())
