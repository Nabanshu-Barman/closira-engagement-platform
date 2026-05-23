# API Contract

## POST /enquiry

Request:

- channel: whatsapp | email | call
- customer_name: string
- message: string

Response:

- enquiry_id: UUID
- status: queued

Side effects:

- create enquiry row
- create created event
- enqueue SOP match task

## POST /enquiry/{id}/followup

Request:

- delay_minutes: int
- template: string (optional)

Response:

- followup_id: UUID
- scheduled_for: timestamp

Side effects:

- create followup row
- create followup_scheduled event

## POST /enquiry/{id}/escalate

Request:

- reason: string

Response:

- enquiry_id: UUID
- status: escalated

Side effects:

- update enquiry status
- create escalated event

## GET /enquiry/{id}/history

Response:

- enquiry: core fields
- events: ordered timeline
- followups: scheduled followups

## GET /health

Response:

- status: ok
- db: ok or error
