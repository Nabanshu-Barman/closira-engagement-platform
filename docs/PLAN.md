# Backend Assignment Execution Blueprint

Date: May 23, 2026

## Architecture and Tech Stack Decision

- Framework: FastAPI
- Database: PostgreSQL
- ORM: SQLAlchemy 2.0 async
- Migrations: Alembic
- Async worker: Celery + Redis
- Validation: Pydantic v2
- Logging: structlog + stdlib logging (JSON)
- Testing: pytest + httpx + pytest-asyncio
- API docs: FastAPI OpenAPI with examples

Rationale: Celery provides a real async worker with separate process, retries, and visibility. BackgroundTasks runs inside the API process and is less reliable for async workflows.

## Complete Project Folder Structure

```
app/
  main.py
  core/
    config.py
    logging.py
    database.py
  api/
    v1/
      router.py
      endpoints/
        enquiry.py
        health.py
  models/
    enquiry.py
    event.py
    followup.py
  schemas/
    enquiry.py
    followup.py
    event.py
    health.py
  services/
    enquiry_service.py
    sop_matcher.py
    followup_service.py
    escalation_service.py
  workers/
    celery_app.py
    tasks.py
  repositories/
    enquiry_repo.py
    event_repo.py
  utils/
    time.py
    enums.py
migrations/
tests/
  api/
  services/
docs/
  api.http
README.md
```

## Database Schema Planning

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

Design notes:
- events table powers the history timeline endpoint.
- followups table isolates scheduling from enquiry core data.

## Endpoint Planning

- POST /enquiry
  - Input: channel, customer_name, message
  - Output: enquiry_id, status=queued
  - Side effect: enqueue Celery task

- POST /enquiry/{id}/followup
  - Input: delay_minutes, optional template
  - Output: followup_id, scheduled_for
  - Side effect: followup event

- POST /enquiry/{id}/escalate
  - Input: reason
  - Output: updated status
  - Side effect: escalation event

- GET /enquiry/{id}/history
  - Output: enquiry + ordered events + followups

- GET /health
  - Output: status + DB connectivity

## Async Task Flow

1. POST /enquiry creates enquiry row + event created
2. API enqueues Celery task process_enquiry(enquiry_id)
3. Worker loads enquiry and runs SOP matcher
4. If matched:
   - update matched_sop, suggested_response, status=matched
   - add sop_matched event
5. If not matched:
   - update status=escalated, reason="No SOP match"
   - add escalated event
6. Logs emitted for each transition

## SOP Matching Strategy

- Hardcode 3 to 5 SOPs in sop_matcher.py
- Each SOP has name, keywords list, suggested_response
- Matching rule: case-insensitive keyword presence
- If multiple matches: select by fixed priority order
- If none: escalate

## Logging and Event Tracking Flow

- JSON logs for:
  - enquiry created
  - task started and finished
  - SOP matched
  - escalation triggered
  - followup scheduled
- events table stores timeline data for /history
- Logs include correlation fields: enquiry_id, event_type, timestamps

## README and Documentation Strategy

- Setup and run instructions
- DB schema and reasoning
- Celery vs BackgroundTasks decision
- Trade-offs and limitations
- .http file with all 5 endpoints

---

# Phase-wise Execution Plan

## Phase 1 - Requirements Breakdown and Architecture

Objectives:
- Translate assignment into components and responsibilities
- Decide async mechanism, schema shape, API contracts

Architecture decisions:
- FastAPI + SQLAlchemy async + Alembic
- Celery worker with Redis broker
- Event table for timeline

Folder structure decisions:
- Layered: api, services, repositories, models, schemas, workers

Database design decisions:
- Normalize followups and events
- Enums for statuses and channels

API design strategy:
- Narrow endpoints, no overloading
- Idempotent escalation behavior

Async processing strategy:
- Celery task for SOP match

Logging strategy:
- JSON logs + events table

Testing strategy:
- Decide API integration vs service tests

Validation and error handling:
- Pydantic validation
- 404, 409, 422, 500

Dependencies required:
- fastapi, uvicorn
- sqlalchemy[asyncio], asyncpg
- alembic
- celery, redis
- pydantic
- structlog
- pytest, httpx, pytest-asyncio

Scalability considerations:
- Worker scales independently
- Events table supports high write volume

Expected outputs:
- Final architecture blueprint + endpoint specs

Common mistakes to avoid:
- Using BackgroundTasks as a true worker
- Storing history only in enquiries table

Estimated implementation order:
1. Confirm stack
2. Design schema
3. Define endpoint specs

## Phase 2 - Database and Model Foundations

Objectives:
- Establish schema, models, migrations

Architecture decisions:
- Async SQLAlchemy engine + session management

Folder structure decisions:
- Create models and repositories early

Database design decisions:
- PKs, FKs, enums, timestamps

API design strategy:
- Align schemas with DB

Async processing strategy:
- Not yet

Logging strategy:
- Basic DB logs

Testing strategy:
- Migration smoke test

Validation and error handling:
- DB constraints for status and channel

Dependencies required:
- SQLAlchemy, Alembic, asyncpg

Scalability considerations:
- Index enquiry_id, created_at

Expected outputs:
- Migrations + ORM models

Common mistakes to avoid:
- Forgetting updated_at
- Conflating events and enquiries

Estimated implementation order:
1. Define enums
2. Create models
3. Generate migrations

## Phase 3 - API Contracts and Schemas

Objectives:
- Define request and response schemas

Architecture decisions:
- Pydantic v2 models with examples

Folder structure decisions:
- schemas/ per domain

Database design decisions:
- Schemas reflect DB fields

API design strategy:
- Consistent response envelopes and errors

Async processing strategy:
- Not yet

Logging strategy:
- Not yet

Testing strategy:
- Schema validation tests

Validation and error handling:
- Custom error detail messages

Dependencies required:
- pydantic, fastapi

Scalability considerations:
- Keep payloads minimal

Expected outputs:
- Stable API schemas

Common mistakes to avoid:
- Missing examples in docs
- Inconsistent naming

Estimated implementation order:
1. Request models
2. Response models
3. Example payloads

## Phase 4 - Core API Implementation

Objectives:
- Implement all 5 endpoints

Architecture decisions:
- Separate API layer from services

Folder structure decisions:
- api/v1/endpoints implemented

Database design decisions:
- Repositories for DB access

API design strategy:
- Validate inputs, consistent error codes

Async processing strategy:
- Enqueue Celery task on POST /enquiry

Logging strategy:
- Log per endpoint invocation

Testing strategy:
- API integration tests

Validation and error handling:
- 404, 409, 422, 500

Dependencies required:
- fastapi, sqlalchemy

Scalability considerations:
- Keep DB transactions small

Expected outputs:
- Running API with /docs

Common mistakes to avoid:
- Blocking on async task
- Missing event logs

Estimated implementation order:
1. Health endpoint
2. Create enquiry
3. Escalate
4. Followup
5. History

## Phase 5 - Async Worker and SOP Logic

Objectives:
- Build Celery worker and SOP matcher

Architecture decisions:
- Celery app with tasks module

Folder structure decisions:
- workers/ and services/sop_matcher.py

Database design decisions:
- Update enquiry with match or escalation

API design strategy:
- Worker independent of API layer

Async processing strategy:
- Task handles SOP match and events

Logging strategy:
- Task lifecycle logs

Testing strategy:
- Unit tests for SOP matcher

Validation and error handling:
- Task catches and logs exceptions

Dependencies required:
- celery, redis

Scalability considerations:
- Task idempotency by enquiry_id

Expected outputs:
- Worker processes tasks

Common mistakes to avoid:
- Missing enquiry handling in worker
- Not updating status on match

Estimated implementation order:
1. Celery app
2. Task skeleton
3. SOP matcher
4. DB updates + events

## Phase 6 - Observability and Documentation

Objectives:
- Structured logging and final docs

Architecture decisions:
- structlog JSON formatting

Folder structure decisions:
- core/logging.py

Database design decisions:
- Event metadata detail

API design strategy:
- Final OpenAPI descriptions

Async processing strategy:
- Documented in README

Logging strategy:
- Standard event keys

Testing strategy:
- Logging sanity checks

Validation and error handling:
- Ensure consistent error format

Dependencies required:
- structlog

Scalability considerations:
- Minimal logging overhead

Expected outputs:
- README + .http file

Common mistakes to avoid:
- README missing run steps
- Docs missing examples

Estimated implementation order:
1. Logging config
2. OpenAPI enhancements
3. README
4. .http file
