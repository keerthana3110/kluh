from typing import Dict, Any, Optional


class CostOptimizer:
    """Identifies high-cost frontier model requests and suggests lower-cost alternatives."""

    @staticmethod
    def evaluate_optimization(payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        model = str(payload.get("requested_model", "")).lower()
        amount = float(payload.get("amount", 0.0))

        if "gpt-5" in model or "gpt-4o" in model:
            rec_cost = round(amount * 0.10, 2)
            return {
                "original_model": payload.get("requested_model"),
                "original_vendor": payload.get("vendor", "OpenAI"),
                "original_cost": amount,
                "recommended_model": "gemini-2.0-flash-exp",
                "recommended_vendor": "Google Gemini API",
                "recommended_cost": rec_cost,
                "savings_percent": 90.0,
                "reasoning": "Google Gemini 2.0 Flash provides sub-second latency and equivalent reasoning benchmark score at 10% of the token cost."
            }

        if "opus" in model:
            rec_cost = round(amount * 0.20, 2)
            return {
                "original_model": payload.get("requested_model"),
                "original_vendor": payload.get("vendor", "Anthropic"),
                "original_cost": amount,
                "recommended_model": "deepseek-r1-reasoner",
                "recommended_vendor": "OpenRouter",
                "recommended_cost": rec_cost,
                "savings_percent": 80.0,
                "reasoning": "DeepSeek-R1 handles chain-of-thought code refactoring with superior mathematical accuracy while saving 80% on token fees."
            }

        return None
