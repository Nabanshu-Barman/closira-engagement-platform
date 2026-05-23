from celery import Celery

from app.core.config import settings


celery_app = Celery(
    "closira_enquiry",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.workers.tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    worker_pool="solo",
    worker_concurrency=1,
)
