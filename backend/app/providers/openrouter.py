from typing import Dict, Any
from app.providers.base import BaseAIProvider


class OpenRouterProvider(BaseAIProvider):
    def __init__(self, key_pool: list[str]):
        super().__init__("OpenRouter", key_pool)

    async def generate(self, prompt: str, model: str = "anthropic/claude-3.5-sonnet", **kwargs) -> Dict[str, Any]:
        key = self.key_pool[self.active_key_index] if self.key_pool else "mock_key"
        return {
            "provider": self.name,
            "model": model,
            "key_used": key[:10] + "...",
            "text": f"[OpenRouter Output] Synthesized response for prompt: '{prompt[:30]}...'",
            "usage": {"prompt_tokens": len(prompt.split()), "completion_tokens": 40}
        }

    async def health_check(self) -> bool:
        return True

    def cost_estimate(self, model: str, input_tokens: int, output_tokens: int) -> float:
        return round((input_tokens * 0.000003) + (output_tokens * 0.000015), 6)

    def token_estimate(self, text: str) -> int:
        return int(len(text) / 4)

    def is_available(self) -> bool:
        return len(self.key_pool) > 0
