from typing import Dict, Any
from app.providers.base import BaseAIProvider


class OllamaProvider(BaseAIProvider):
    def __init__(self, endpoint_url: str = "http://localhost:11434"):
        super().__init__("Local Ollama", [endpoint_url])

    async def generate(self, prompt: str, model: str = "llama3:8b", **kwargs) -> Dict[str, Any]:
        return {
            "provider": self.name,
            "model": model,
            "key_used": "localhost",
            "text": f"[Ollama Local Output] Response for prompt: '{prompt[:30]}...'",
            "usage": {"prompt_tokens": len(prompt.split()), "completion_tokens": 35}
        }

    async def health_check(self) -> bool:
        return True

    def cost_estimate(self, model: str, input_tokens: int, output_tokens: int) -> float:
        return 0.0 # Free local inference

    def token_estimate(self, text: str) -> int:
        return int(len(text) / 4)

    def is_available(self) -> bool:
        return True
