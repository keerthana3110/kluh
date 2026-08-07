from abc import ABC, abstractmethod
from typing import Dict, Any, Optional


class BaseAIProvider(ABC):
    """Abstract interface for all supported AI providers (Gemini, Grok, OpenRouter, Ollama)."""

    def __init__(self, name: str, key_pool: list[str]):
        self.name = name
        self.key_pool = key_pool
        self.active_key_index = 0

    @abstractmethod
    async def generate(self, prompt: str, model: str, **kwargs) -> Dict[str, Any]:
        """Executes API generation request."""
        pass

    @abstractmethod
    async def health_check(self) -> bool:
        """Returns True if provider is responsive and operational."""
        pass

    @abstractmethod
    def cost_estimate(self, model: str, input_tokens: int, output_tokens: int) -> float:
        """Estimates cost in USD for token usage."""
        pass

    @abstractmethod
    def token_estimate(self, text: str) -> int:
        """Estimates token count for given string."""
        pass

    @abstractmethod
    def is_available(self) -> bool:
        """Checks if provider has available active keys."""
        pass
