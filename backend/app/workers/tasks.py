import asyncio
from uuid import UUID

from app.core.database import AsyncSessionLocal
from app.core.logging import get_logger
from app.models.enquiry import Enquiry
from app.models.event import Event
from app.models.followup import Followup
from app.repositories.event_repo import create_event
from app.services.sop_matcher import match_sop
from app.utils.enums import EnquiryStatusEnum, EventTypeEnum
from app.workers.celery_app import celery_app


logger = get_logger(__name__)
_event_loop: asyncio.AbstractEventLoop | None = None


def _run_async(coro: asyncio.Future) -> None:
    global _event_loop
    if _event_loop is None or _event_loop.is_closed():
        _event_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(_event_loop)
    _event_loop.run_until_complete(coro)


async def _process_enquiry(enquiry_id: UUID) -> None:
    async with AsyncSessionLocal() as session:
        enquiry = await session.get(Enquiry, enquiry_id)
        if not enquiry:
            logger.warning("enquiry.not_found", enquiry_id=str(enquiry_id))
            return

        logger.info("task.processed", enquiry_id=str(enquiry.id))

        rule = match_sop(enquiry.message)
        if rule:
            enquiry.status = EnquiryStatusEnum.matched
            enquiry.matched_sop = rule.name
            enquiry.suggested_response = rule.response
            await create_event(
                session,
                enquiry_id=enquiry.id,
                event_type=EventTypeEnum.sop_matched,
                metadata={"sop": rule.name},
            )
            logger.info("sop.matched", enquiry_id=str(enquiry.id), sop=rule.name)
        else:
            enquiry.status = EnquiryStatusEnum.escalated
            enquiry.escalation_reason = "No SOP match"
            await create_event(
                session,
                enquiry_id=enquiry.id,
                event_type=EventTypeEnum.escalated,
                metadata={"reason": "No SOP match"},
            )
            logger.info("enquiry.escalated", enquiry_id=str(enquiry.id), reason="No SOP match")

        await session.commit()


@celery_app.task(name="app.workers.tasks.process_enquiry")
def process_enquiry(enquiry_id: str) -> None:
    _run_async(_process_enquiry(UUID(enquiry_id)))
