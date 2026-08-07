from typing import Dict, Any, List


class RiskEngine:
    """Multi-factor AI Risk Evaluator (0 to 100 Score)."""

    TRUSTED_VENDORS = ["openai", "openrouter", "google", "anthropic", "amadeus", "bloomberg", "github", "stripe", "perplexity"]

    @staticmethod
    def evaluate_risk(payload: Dict[str, Any], request_velocity: int = 1) -> Dict[str, Any]:
        amount = float(payload.get("amount", 0.0))
        vendor = str(payload.get("vendor", "")).lower()
        model = str(payload.get("requested_model", "")).lower()

        factors: List[Dict[str, Any]] = []

        # 1. Amount Severity
        if amount > 1000:
          amount_score = 90
          factors.append({"factor": "High Amount Severity", "score": 90, "description": f"Spend amount (${amount:.2f}) > $1,000 threshold."})
        elif amount > 100:
          amount_score = 60
          factors.append({"factor": "Moderate Spend Severity", "score": 60, "description": f"Spend amount (${amount:.2f}) > $100 threshold."})
        elif amount > 20:
          amount_score = 30
          factors.append({"factor": "Standard Limit", "score": 30, "description": f"Spend amount (${amount:.2f}) requires routine review."})
        else:
          amount_score = 5
          factors.append({"factor": "Micro Spend", "score": 5, "description": "Micro-transaction under $20 limit."})

        # 2. Vendor & Model Risk
        vendor_score = 10
        if not any(tv in vendor for tv in RiskEngine.TRUSTED_VENDORS):
          vendor_score = 75
          factors.append({"factor": "Untrusted Vendor", "score": 75, "description": f"Vendor '{vendor}' is unverified."})
        
        if "gpt-5" in model or "opus-4" in model or "unrestricted" in model:
          vendor_score += 25
          factors.append({"factor": "Frontier Model Risk", "score": 85, "description": f"Model '{model}' is an experimental frontier model."})

        # 3. Request Velocity Burst
        velocity_score = 0
        if request_velocity > 20:
          velocity_score = 85
          factors.append({"factor": "Rapid Request Burst", "score": 85, "description": f"High frequency burst: {request_velocity} requests in window."})
        elif request_velocity > 5:
          velocity_score = 35
          factors.append({"factor": "Elevated Velocity", "score": 35, "description": f"{request_velocity} requests in window."})

        # Weighted calculation
        total_score = min(100, max(0, int((amount_score * 0.45) + (vendor_score * 0.35) + (velocity_score * 0.20))))

        category = "Low"
        if total_score >= 75:
          category = "Critical"
        elif total_score >= 50:
          category = "High"
        elif total_score >= 25:
          category = "Medium"

        return {
            "risk_score": total_score,
            "risk_category": category,
            "factors": factors,
            "reasoning": f"Calculated risk score {total_score}/100 ({category} risk category)."
        }
