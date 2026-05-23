from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.enquiry import Enquiry


async def get_enquiry(session: AsyncSession, enquiry_id: UUID) -> Enquiry | None:
    return await session.get(Enquiry, enquiry_id)


async def create_enquiry(session: AsyncSession, enquiry: Enquiry) -> Enquiry:
    session.add(enquiry)
    await session.flush()
    return enquiry


async def list_enquiries(session: AsyncSession) -> list[Enquiry]:
    result = await session.execute(select(Enquiry))
    return list(result.scalars().all())
