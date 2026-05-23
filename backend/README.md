# Breakout Escape Room Enquiry Backend

This repository contains a backend service that simulates Breakout Escape Room's customer enquiry workflow.

## Phase 1 Deliverables

- Architecture and stack decision
- Initial project structure
- API contract and data model planning

## Architecture and Stack

- API framework: FastAPI
- Database: PostgreSQL
- ORM: SQLAlchemy 2.0 (async engine)
- Migrations: Alembic
- Async worker: Celery + Redis
- Validation: Pydantic v2
- Logging: structlog + stdlib logging JSON
- Testing: pytest + httpx + pytest-asyncio

Rationale: Celery provides a real async worker process with retry and visibility, unlike FastAPI BackgroundTasks which run inside the API process.

Database choice: PostgreSQL is used via Supabase for realistic production-style persistence and history queries.

## API Endpoints

- POST /enquiry
  - Create an enquiry and enqueue SOP matching (response includes enquiry_id as the job ID)
- POST /enquiry/{id}/followup
  - Schedule a follow-up for an enquiry
- POST /enquiry/{id}/escalate
  - Escalate enquiry to a human agent
- GET /enquiry/{id}/history
  - Return full timeline and current state
- GET /health
  - Health check for API and DB connectivity

See ../docs/endpoint-spec.md for details.

## Data Model

- enquiries: core enquiry record with status and SOP match fields
- events: timeline entries for history
- followups: follow-up schedule and state

See ../docs/architecture.md for the full schema plan and async flow.

## Setup

1. From the repo root, enter the backend folder:

  cd backend

2. Create a virtual environment and install dependencies:

   C:/Games/conda/python.exe -m pip install -r requirements.txt

3. Copy .env.example to .env and fill in the values.

  IMPORTANT: Do not commit .env to Git.

4. Run migrations:

   C:/Games/conda/python.exe -m alembic upgrade head

## Run

API:

  C:/Games/conda/python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000

Worker:

  C:/Games/conda/python.exe -m celery -A app.workers.celery_app.celery_app worker --loglevel=INFO

Redis:

  redis-server

Docs:

  http://127.0.0.1:8000/docs

## API Test File

Use ../docs/api.http to exercise all endpoints with example payloads.

## Demo Quickstart

1. Start Redis, the Celery worker, and the API (see Run section).
2. Open ../docs/api.http and run the requests in order.
3. Confirm /enquiry/{id}/history shows matched_sop and a sop_matched event.

## Logging

Structured JSON logs are enabled via structlog. Key events include:

- enquiry.created
- task.processed
- sop.matched
- enquiry.escalated
- followup.scheduled

## Celery vs BackgroundTasks

Celery runs as a separate worker process and provides reliable async processing with retries and visibility. FastAPI BackgroundTasks run inside the API process and are not resilient to process restarts.

## Limitations

- SOP matching uses basic keyword checks only
- No authentication or multi-tenant separation
- Follow-up delivery is not implemented yet

## Tests

  C:/Games/conda/python.exe -m pytest

## Submission Checklist

- README includes setup, schema, and trade-offs
- docs/api.http includes all endpoints
- /docs provides complete OpenAPI documentation
- Database migrations applied to Supabase

## Database Schema Reasoning

- enquiries holds the current status and SOP match outcome
- events provides an immutable timeline for history and auditing
- followups tracks scheduled follow-up requests separately from enquiry state

## Phase 3 Deliverables

- Request and response models with examples
- Health and history response schemas
- FastAPI OpenAPI metadata for professional /docs structure

## Phase 5 Deliverables

- Celery worker tasks for SOP processing
- SOP matching engine with hardcoded rules

## Phase 2 Deliverables

- requirements.txt dependency list
- SQLAlchemy ORM models and enums
- Alembic configuration for migrations
- Environment configuration template

## Phase 6 Deliverables

- Structured logging and request tracing
- API test file for manual validation
- SOP matcher unit tests

## Supabase (PostgreSQL) Setup

1. Create a project in Supabase and wait for provisioning.
2. In Project Settings -> Database, copy the connection strings.
3. Set the async and sync URLs in your .env file:

  - DATABASE_URL should use the async driver (postgresql+asyncpg)
  - DATABASE_URL_SYNC should use the sync driver (postgresql+psycopg)

Example:

DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/DBNAME
DATABASE_URL_SYNC=postgresql+psycopg://USER:PASSWORD@HOST:5432/DBNAME

4. Ensure your IP is allow-listed in Supabase Network settings if required.