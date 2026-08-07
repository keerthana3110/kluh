import pytest
import asyncio
from app.providers.pool_manager import key_pool_manager


@pytest.mark.asyncio
async def test_key_pool_round_robin_rotation():
    initial_index = key_pool_manager.providers["Gemini"].active_key_index
    rotated_key = key_pool_manager.rotate_key_for_provider("Gemini")
    new_index = key_pool_manager.providers["Gemini"].active_key_index
    assert new_index != initial_index or len(key_pool_manager.providers["Gemini"].key_pool) == 1


@pytest.mark.asyncio
async def test_execute_with_fallback():
    res = await key_pool_manager.execute_with_fallback(
        prompt="Test execution synthesis", preferred_provider="Gemini"
    )
    assert "provider" in res
    assert res["provider"] in ["Gemini", "Grok", "OpenRouter", "Local Ollama"]
