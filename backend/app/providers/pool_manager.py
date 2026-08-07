import time
from typing import Dict, Any, Optional, List
from app.config.settings import settings
from app.providers.gemini import GeminiProvider
from app.providers.grok import GrokProvider
from app.providers.openrouter import OpenRouterProvider
from app.providers.ollama import OllamaProvider


class APIKeyPoolManager:
    """
    Orchestrates round-robin API key pool rotation, 429 quota exhaustion failover,
    cooldown recovery, and fallback execution across Gemini -> Grok -> OpenRouter -> Ollama.
    """

    def __init__(self):
        self.providers = {
            "Gemini": GeminiProvider(settings.gemini_key_list),
            "Grok": GrokProvider(settings.grok_key_list),
            "OpenRouter": OpenRouterProvider(settings.openrouter_key_list),
            "Ollama": OllamaProvider(settings.OLLAMA_URL),
        }
        self.fallback_order = ["Gemini", "Grok", "OpenRouter", "Ollama"]
        
        # Track key health and cooldown timestamps: key -> cooldown_expire_time
        self.cooldowns: Dict[str, float] = {}

    def get_active_provider(self, preferred_provider: str = "Gemini"):
        order = [preferred_provider] + [p for p in self.fallback_order if p != preferred_provider]
        for p_name in order:
            p_obj = self.providers.get(p_name)
            if p_obj and p_obj.is_available():
                return p_obj
        return self.providers["Ollama"]

    def rotate_key_for_provider(self, provider_name: str) -> str:
        provider = self.providers.get(provider_name)
        if not provider or not provider.key_pool:
            return ""
        
        provider.active_key_index = (provider.active_key_index + 1) % len(provider.key_pool)
        return provider.key_pool[provider.active_key_index]

    def report_quota_error(self, provider_name: str, key: str):
        """Puts failed key into 60s cooldown and rotates to next key."""
        self.cooldowns[key] = time.time() + 60.0
        self.rotate_key_for_provider(provider_name)

    async def execute_with_fallback(
        self,
        prompt: str,
        preferred_provider: str = "Gemini",
        model: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes prompt generation with automatic fallback & key rotation.
        Ensures no request fails because a single key hit quota limits.
        """
        order = [preferred_provider] + [p for p in self.fallback_order if p != preferred_provider]

        for p_name in order:
            provider = self.providers[p_name]
            attempts = len(provider.key_pool) if provider.key_pool else 1

            for _ in range(attempts):
                current_key = provider.key_pool[provider.active_key_index] if provider.key_pool else "local"

                # Skip if in cooldown
                if self.cooldowns.get(current_key, 0) > time.time():
                    self.rotate_key_for_provider(p_name)
                    continue

                try:
                    res = await provider.generate(prompt=prompt, model=model or "default")
                    return res
                except Exception as e:
                    # Treat exception as rate limit / quota error
                    self.report_quota_error(p_name, current_key)

        # Fallback to local Ollama if all cloud keys fail
        return await self.providers["Ollama"].generate(prompt=prompt, model="llama3:8b")


key_pool_manager = APIKeyPoolManager()
