import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_x402_middleware_returns_402_when_header_missing():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/v1/spend-request/protected-execute", json={
            "agent_id": "test-agent",
            "vendor": "OpenAI",
            "api_endpoint": "https://api.openai.com/v1/chat",
            "requested_model": "gpt-4o",
            "amount": 10.0,
            "purpose": "Test x402 enforcement"
        })
        assert res.status_code == 402
        assert res.headers.get("X-402-Authorize") == "required"
        assert "WWW-Authenticate" in res.headers
        data = res.json()
        assert data["error"] == "Payment Required"
