from typing import Dict, Any
from app.providers.base import BaseAIProvider


class GrokProvider(BaseAIProvider):
    def __init__(self, key_pool: list[str]):
        super().__init__("Grok", key_pool)

    async def generate(self, prompt: str, model: str = "grok-2", **kwargs) -> Dict[str, Any]:
        key = self.key_pool[self.active_key_index] if self.key_pool else "mock_key"
        return {
            "provider": self.name,
            "model": model,
            "key_used": key[:10] + "...",
            "text": f"[Grok xAI Output] Response for prompt: '{prompt[:30]}...'",
            "usage": {"prompt_tokens": len(prompt.split()), "completion_tokens": 50}
        }

    async def health_check(self) -> bool:
        return True

    def cost_estimate(self, model: str, input_tokens: int, output_tokens: int) -> float:
        return round((input_tokens * 0.000002) + (output_tokens * 0.00001), 6)

    def token_estimate(self, text: str) -> int:
        return int(len(text) / 4)

    def is_available(self) -> bool:
        return len(self.key_pool) > 0
