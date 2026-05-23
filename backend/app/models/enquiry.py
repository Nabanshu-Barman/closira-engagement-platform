import uuid

from sqlalchemy import Enum, String, Text, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.utils.enums import ChannelEnum, EnquiryStatusEnum


class Enquiry(Base):
    __tablename__ = "enquiries"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    channel: Mapped[ChannelEnum] = mapped_column(Enum(ChannelEnum), nullable=False)
    customer_name: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)

    status: Mapped[EnquiryStatusEnum] = mapped_column(
        Enum(EnquiryStatusEnum),
        nullable=False,
        default=EnquiryStatusEnum.open,
    )
    matched_sop: Mapped[str | None] = mapped_column(String(200), nullable=True)
    suggested_response: Mapped[str | None] = mapped_column(Text, nullable=True)
    escalation_reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[DateTime | None] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    events = relationship("Event", back_populates="enquiry", cascade="all, delete-orphan")
    followups = relationship("Followup", back_populates="enquiry", cascade="all, delete-orphan")
