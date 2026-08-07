import pytest
from app.engines.policy_engine import PolicyEngine


def test_policy_engine_allow_pass():
    payload = {
        "amount": 15.0,
        "vendor": "OpenAI",
        "requested_model": "gpt-4o",
        "department": "Marketing"
    }
    policies = [{
        "name": "Marketing $20 Cap",
        "department": "Marketing",
        "action": "REQUIRE_APPROVAL",
        "max_single_spend": 20.0,
        "denied_models": ["gpt-5"]
    }]

    res = PolicyEngine.evaluate_policies(payload, policies)
    assert res["allowed"] is True
    assert res["action"] == "ALLOW"


def test_policy_engine_single_spend_exceeded():
    payload = {
        "amount": 45.0,
        "vendor": "OpenAI",
        "requested_model": "gpt-4o",
        "department": "Marketing"
    }
    policies = [{
        "name": "Marketing $20 Cap",
        "department": "Marketing",
        "action": "REQUIRE_APPROVAL",
        "max_single_spend": 20.0,
        "denied_models": []
    }]

    res = PolicyEngine.evaluate_policies(payload, policies)
    assert res["allowed"] is False
    assert res["action"] == "REQUIRE_APPROVAL"


def test_policy_engine_denied_model_block():
    payload = {
        "amount": 10.0,
        "vendor": "OpenAI",
        "requested_model": "gpt-5-vision",
        "department": "Coding"
    }
    policies = [{
        "name": "Frontier Model Block",
        "department": "All",
        "action": "DENY",
        "max_single_spend": 100.0,
        "denied_models": ["gpt-5"]
    }]

    res = PolicyEngine.evaluate_policies(payload, policies)
    assert res["allowed"] is False
    assert res["action"] == "DENY"
    assert "prohibited" in res["reason"]
