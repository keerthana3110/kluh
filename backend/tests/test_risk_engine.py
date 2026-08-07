import pytest
from app.engines.risk_engine import RiskEngine


def test_risk_engine_micro_transaction():
    payload = {
        "amount": 5.0,
        "vendor": "OpenAI",
        "requested_model": "gpt-4o"
    }
    res = RiskEngine.evaluate_risk(payload, request_velocity=1)
    assert res["risk_score"] < 25
    assert res["risk_category"] == "Low"


def test_risk_engine_high_risk_transaction():
    payload = {
        "amount": 1500.0,
        "vendor": "Unknown Third Party API",
        "requested_model": "gpt-5-unrestricted"
    }
    res = RiskEngine.evaluate_risk(payload, request_velocity=25)
    assert res["risk_score"] >= 75
    assert res["risk_category"] == "Critical"
    assert len(res["factors"]) >= 3
