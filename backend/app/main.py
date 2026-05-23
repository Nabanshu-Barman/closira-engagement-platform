import time

from fastapi import FastAPI, Request

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.logging import bind_request_context, clear_request_context, configure_logging, get_logger


tags_metadata = [
    {
        "name": "enquiries",
        "description": "Create, follow up, escalate, and retrieve enquiry history.",
    },
    {
        "name": "health",
        "description": "Service health and database connectivity checks.",
    },
]

configure_logging(settings.log_level)
logger = get_logger(__name__)

app = FastAPI(
    title="Breakout Escape Room Enquiry Backend",
    version="0.1.0",
    description=(
        "Backend service that processes Breakout Escape Room enquiries, matches SOPs, "
        "and tracks status timelines."
    ),
    openapi_tags=tags_metadata,
)

app.include_router(api_router)


@app.middleware("http")
async def request_logging(request: Request, call_next):
    start_time = time.perf_counter()
    bind_request_context(
        method=request.method,
        path=request.url.path,
    )
    response = None
    try:
        response = await call_next(request)
        return response
    finally:
        duration_ms = int((time.perf_counter() - start_time) * 1000)
        status_code = response.status_code if response else 500
        logger.info("request.completed", status_code=status_code, duration_ms=duration_ms)
        clear_request_context()
