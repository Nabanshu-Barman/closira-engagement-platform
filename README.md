# Closira Engagement Platform (Full-Stack Assignment)

This repository is structured for both backend and frontend submissions. The backend is complete. The frontend scaffold is prepared and will be implemented later.

## Repository Structure

- backend/  (completed FastAPI + Celery backend)
- frontend/ (placeholder for React Native app)
- docs/     (shared documentation and API test file)

## Backend Status

Completed and ready for submission. See backend/README.md for full setup and run instructions.

## Frontend Status

Scaffold only. The React Native app will be added under frontend/ later.

## Quick Start (Backend)

From repo root:

1. cd backend
2. C:/Games/conda/python.exe -m pip install -r requirements.txt
3. Copy .env.example to .env and fill values
4. C:/Games/conda/python.exe -m alembic upgrade head
5. C:/Games/conda/python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
6. In another terminal: C:/Games/conda/python.exe -m celery -A app.workers.celery_app.celery_app worker --loglevel=INFO

API docs:
- http://127.0.0.1:8000/docs

API test file:
- docs/api.http
