from typing import Dict, Any, Tuple


class ApprovalEngine:
    """Multi-tier human approval threshold engine."""

    @staticmethod
    def determine_approval_tier(amount: float) -> Tuple[str, str]:
        """
        Returns (status, required_approval_tier)
        - < $20: Auto Approve
        - $20 - $100: Manager Approval
        - $100 - $1,000: Finance Approval
        - > $1,000: Executive Approval
        """
        if amount > 1000.0:
            return "pending_approval", "Executive"
        elif amount > 100.0:
            return "pending_approval", "Finance"
        elif amount >= 20.0:
            return "pending_approval", "Manager"
        else:
            return "auto_approved", "None"
