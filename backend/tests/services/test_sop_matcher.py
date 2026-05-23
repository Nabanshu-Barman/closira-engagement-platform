from app.services.sop_matcher import match_sop


def test_match_pricing() -> None:
    rule = match_sop("What is the pricing for 8 players at Breakout Escape Room?")
    assert rule is not None
    assert rule.name == "pricing_enquiry"


def test_match_none() -> None:
    rule = match_sop("Hello there")
    assert rule is None


def test_match_corporate() -> None:
    rule = match_sop("We need a corporate team outing for 12 people")
    assert rule is not None
    assert rule.name == "corporate_team_outing"
