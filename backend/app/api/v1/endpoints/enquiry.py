from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.models.enquiry import Enquiry
from app.models.followup import Followup
from app.repositories.enquiry_repo import create_enquiry, get_enquiry
from app.repositories.event_repo import create_event, list_events
from app.repositories.followup_repo import create_followup, list_followups
from app.schemas.enquiry import (
    EnquiryCreate,
    EnquiryCreatedResponse,
    EnquiryEscalateRequest,
    EnquiryEscalateResponse,
    EnquiryHistoryResponse,
    EnquiryOut,
)
from app.schemas.followup import FollowupCreate, FollowupCreatedResponse
from app.utils.enums import EnquiryStatusEnum, EventTypeEnum
from app.workers.celery_app import celery_app
from app.core.logging import get_logger


router = APIRouter(prefix="/enquiry", tags=["enquiries"])
logger = get_logger(__name__)


@router.post(
    "",
    response_model=EnquiryCreatedResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new enquiry",
    description="Creates an enquiry record and enqueues SOP matching in the background.",
)
async def create_enquiry_endpoint(
    payload: EnquiryCreate,
    session: AsyncSession = Depends(get_session),
) -> EnquiryCreatedResponse:
    enquiry = Enquiry(
        channel=payload.channel,
        customer_name=payload.customer_name,
        message=payload.message,
    )
    await create_enquiry(session, enquiry)
    await create_event(
        session,
        enquiry_id=enquiry.id,
        event_type=EventTypeEnum.created,
        metadata={
            "channel": payload.channel.value,
            "customer_name": payload.customer_name,
        },
    )
    await session.commit()

    logger.info("enquiry.created", enquiry_id=str(enquiry.id), channel=payload.channel.value)

    try:
        celery_app.send_task("app.workers.tasks.process_enquiry", args=[str(enquiry.id)])
    except Exception as exc:
        logger.warning("task.enqueue_failed", enquiry_id=str(enquiry.id), error=str(exc))

    return EnquiryCreatedResponse(enquiry_id=enquiry.id, status="queued")


@router.post(
    "/{enquiry_id}/followup",
    response_model=FollowupCreatedResponse,
    summary="Schedule a follow-up",
    description="Schedules a follow-up for an open enquiry.",
)
async def schedule_followup(
    enquiry_id: UUID,
    payload: FollowupCreate,
    session: AsyncSession = Depends(get_session),
) -> FollowupCreatedResponse:
    enquiry = await get_enquiry(session, enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enquiry not found")

    if enquiry.status == EnquiryStatusEnum.escalated:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot schedule follow-up for an escalated enquiry",
        )

    scheduled_for = datetime.now(timezone.utc) + timedelta(minutes=payload.delay_minutes)
    followup = Followup(
        enquiry_id=enquiry.id,
        delay_minutes=payload.delay_minutes,
        template=payload.template,
        scheduled_for=scheduled_for,
    )
    await create_followup(session, followup)

    enquiry.status = EnquiryStatusEnum.followup_scheduled
    await create_event(
        session,
        enquiry_id=enquiry.id,
        event_type=EventTypeEnum.followup_scheduled,
        metadata={"delay_minutes": payload.delay_minutes},
    )
    await session.commit()

    logger.info("followup.scheduled", enquiry_id=str(enquiry.id), delay_minutes=payload.delay_minutes)

    return FollowupCreatedResponse(followup_id=followup.id, scheduled_for=scheduled_for)


@router.post(
    "/{enquiry_id}/escalate",
    response_model=EnquiryEscalateResponse,
    summary="Escalate an enquiry",
    description="Marks an enquiry as escalated to a human agent.",
)
async def escalate_enquiry(
    enquiry_id: UUID,
    payload: EnquiryEscalateRequest,
    session: AsyncSession = Depends(get_session),
) -> EnquiryEscalateResponse:
    enquiry = await get_enquiry(session, enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enquiry not found")

    if enquiry.status == EnquiryStatusEnum.escalated:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Enquiry is already escalated",
        )

    enquiry.status = EnquiryStatusEnum.escalated
    enquiry.escalation_reason = payload.reason

    await create_event(
        session,
        enquiry_id=enquiry.id,
        event_type=EventTypeEnum.escalated,
        metadata={"reason": payload.reason},
    )
    await session.commit()

    logger.info("enquiry.escalated", enquiry_id=str(enquiry.id), reason=payload.reason)

    return EnquiryEscalateResponse(enquiry_id=enquiry.id, status="escalated")


@router.get(
    "/{enquiry_id}/history",
    response_model=EnquiryHistoryResponse,
    summary="Get enquiry history",
    description="Returns enquiry details and full status timeline.",
)
async def enquiry_history(
    enquiry_id: UUID,
    session: AsyncSession = Depends(get_session),
) -> EnquiryHistoryResponse:
    enquiry = await get_enquiry(session, enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enquiry not found")

    events = await list_events(session, enquiry_id)
    followups = await list_followups(session, enquiry_id)

    logger.info("enquiry.history", enquiry_id=str(enquiry.id))

    return EnquiryHistoryResponse(
        enquiry=EnquiryOut.model_validate(enquiry),
        events=[e for e in events],
        followups=[f for f in followups],
    )
