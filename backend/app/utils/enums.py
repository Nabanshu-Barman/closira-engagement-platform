from enum import Enum


class ChannelEnum(str, Enum):
    whatsapp = "whatsapp"
    email = "email"
    call = "call"


class EnquiryStatusEnum(str, Enum):
    open = "open"
    matched = "matched"
    escalated = "escalated"
    followup_scheduled = "followup_scheduled"
    closed = "closed"


class EventTypeEnum(str, Enum):
    created = "created"
    sop_matched = "sop_matched"
    escalated = "escalated"
    followup_scheduled = "followup_scheduled"
    followup_triggered = "followup_triggered"


class FollowupStatusEnum(str, Enum):
    scheduled = "scheduled"
    sent = "sent"
    cancelled = "cancelled"
