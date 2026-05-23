from dataclasses import dataclass


@dataclass(frozen=True)
class SopRule:
    name: str
    keywords: tuple[str, ...]
    response: str


SOP_RULES: tuple[SopRule, ...] = (
    SopRule(
        name="room_booking",
        keywords=("book", "booking", "reserve", "slot", "time"),
        response="Thanks for reaching out to Breakout Escape Room. What date, time, and group size?",
    ),
    SopRule(
        name="pricing_enquiry",
        keywords=("price", "pricing", "cost", "quote", "rate"),
        response="Happy to help with pricing. How many players and which room are you considering?",
    ),
    SopRule(
        name="birthday_event",
        keywords=("birthday", "party", "celebration"),
        response="We can host birthday groups. What date, age group, and headcount?",
    ),
    SopRule(
        name="corporate_team_outing",
        keywords=("corporate", "team", "offsite", "team building"),
        response="We can support corporate team outings. What date and team size?",
    ),
    SopRule(
        name="refund_support",
        keywords=("refund", "reschedule", "cancel", "complaint", "issue"),
        response="Sorry about the trouble. Please share your booking details and we will assist.",
    ),
)


def match_sop(message: str) -> SopRule | None:
    message_lower = message.lower()
    tokens = {token.strip() for token in message_lower.replace("-", " ").split() if token.strip()}
    for rule in SOP_RULES:
        for keyword in rule.keywords:
            if " " in keyword:
                if keyword in message_lower:
                    return rule
            elif keyword in tokens:
                return rule
    return None
