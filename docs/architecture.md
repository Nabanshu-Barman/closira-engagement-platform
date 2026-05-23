# Architecture Blueprint

## System Overview

A FastAPI service receives inbound Breakout Escape Room enquiries and stores them in PostgreSQL. A Celery worker processes each enquiry asynchronously to match a hardcoded SOP and update the enquiry state. The API exposes history and status endpoints backed by a timeline events table.

## Key Components

- FastAPI API service
- PostgreSQL database
- Celery worker + Redis broker
- SQLAlchemy async ORM + Alembic migrations

## Async Workflow

1. POST /enquiry creates an enquiry row and a created event.
2. API enqueues a Celery task to process the enquiry.
3. Worker loads the enquiry, runs SOP matching, and updates the enquiry.
4. Worker appends sop_matched or escalated event.

## SOP Matching Strategy

- 3 to 5 hardcoded SOPs with keyword lists
- Case-insensitive keyword presence
- Fixed priority order if multiple match
- Escalate when none match

## Database Schema Plan

### enquiries

- id (UUID, PK)
- channel (enum: whatsapp, email, call)
- customer_name (varchar)
- message (text)
- status (enum: open, matched, escalated, followup_scheduled, closed)
- matched_sop (varchar, nullable)
- suggested_response (text, nullable)
- escalation_reason (text, nullable)
- created_at, updated_at (timestamp)

### events

- id (UUID, PK)
- enquiry_id (FK)
- event_type (enum: created, sop_matched, escalated, followup_scheduled, followup_triggered)
- metadata (jsonb)
- created_at (timestamp)

### followups

- id (UUID, PK)
- enquiry_id (FK)
- delay_minutes (int)
- template (text, nullable)
- status (enum: scheduled, sent, cancelled)
- scheduled_for (timestamp)
- created_at (timestamp)

## Logging Plan

- JSON structured logs for enquiry creation, SOP match, escalation, follow-up scheduling
- Log fields include enquiry_id, event_type, timestamps

## Scalability Notes

- Celery worker scales independently from API
- events table supports high write volume and history queries
- Index on enquiry_id and created_at
