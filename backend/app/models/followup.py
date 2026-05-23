import uuid

from sqlalchemy import Enum, DateTime, func, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.utils.enums import FollowupStatusEnum


class Followup(Base):
    __tablename__ = "followups"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    enquiry_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("enquiries.id"), nullable=False)
    delay_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    template: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[FollowupStatusEnum] = mapped_column(
        Enum(FollowupStatusEnum),
        nullable=False,
        default=FollowupStatusEnum.scheduled,
    )
    scheduled_for: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    enquiry = relationship("Enquiry", back_populates="followups")
