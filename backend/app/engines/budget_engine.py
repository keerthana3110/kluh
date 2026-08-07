from typing import Dict, Any


class BudgetEngine:
    """Tracks daily & monthly burn rates, cap allocations, and forecasts."""

    @staticmethod
    def evaluate_budget_cap(
        amount: float,
        current_today: float,
        daily_cap: float,
        current_month: float,
        monthly_cap: float
    ) -> Dict[str, Any]:
        if current_today + amount > daily_cap:
            return {
                "exceeded": True,
                "cap_type": "Daily",
                "current": current_today,
                "requested": amount,
                "cap": daily_cap,
                "reason": f"Request amount (${amount:.2f}) exceeds remaining daily agent budget cap (${daily_cap - current_today:.2f})."
            }
        
        if current_month + amount > monthly_cap:
            return {
                "exceeded": True,
                "cap_type": "Monthly",
                "current": current_month,
                "requested": amount,
                "cap": monthly_cap,
                "reason": f"Request amount (${amount:.2f}) exceeds remaining monthly agent budget cap (${monthly_cap - current_month:.2f})."
            }

        return {
            "exceeded": False,
            "remaining_daily": daily_cap - (current_today + amount),
            "remaining_monthly": monthly_cap - (current_month + amount)
        }

    @staticmethod
    def calculate_forecast(current_month_spent: float, day_of_month: int = 7) -> float:
        """Projects monthly spend based on current daily velocity."""
        if day_of_month <= 0:
            return current_month_spent
        daily_velocity = current_month_spent / day_of_month
        return round(daily_velocity * 30, 2)
