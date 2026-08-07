import httpx
from typing import Dict, Any
from app.providers.base import BaseAIProvider


class GeminiProvider(BaseAIProvider):
    def __init__(self, key_pool: list[str]):
        super().__init__("Gemini", key_pool)

    async def generate(self, prompt: str, model: str = "gemini-2.0-flash-exp", **kwargs) -> Dict[str, Any]:
        # Simulates outbound API execution with active key pool
        key = self.key_pool[self.active_key_index] if self.key_pool else "mock_key"
        return {
            "provider": self.name,
            "model": model,
            "key_used": key[:10] + "...",
            "text": f"[Gemini API Output] Generated response for prompt: '{prompt[:30]}...'",
            "usage": {"prompt_tokens": len(prompt.split()), "completion_tokens": 42}
        }

    async def health_check(self) -> bool:
        return True

    def cost_estimate(self, model: str, input_tokens: int, output_tokens: int) -> float:
        return round((input_tokens * 0.00000015) + (output_tokens * 0.0000006), 6)

    def token_estimate(self, text: str) -> int:
        return int(len(text) / 4)

    def is_available(self) -> bool:
        return len(self.key_pool) > 0
