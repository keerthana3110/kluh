import time
import uuid
from typing import Dict, Any, List, Optional
from app.engines.policy_engine import PolicyEngine
from app.engines.budget_engine import BudgetEngine
from app.engines.risk_engine import RiskEngine
from app.engines.approval_engine import ApprovalEngine
from app.engines.cost_optimizer import CostOptimizer
from app.services.algorand_service import AlgorandService
from app.providers.pool_manager import key_pool_manager
from app.websocket.manager import ws_manager


class SpendService:
    """Central Pipeline Orchestrator for Sentinel AI Spend Authorization."""

    @staticmethod
    async def process_spend_request(
        agent_id: str,
        agent_name: str,
        department: str,
        vendor: str,
        api_endpoint: str,
        requested_model: str,
        amount: float,
        purpose: str,
        active_policies: List[Dict[str, Any]],
        agent_daily_budget: float = 100.0,
        agent_monthly_budget: float = 2000.0,
        agent_current_today: float = 0.0,
        agent_current_month: float = 0.0,
    ) -> Dict[str, Any]:
        payload = {
            "agent_id": agent_id,
            "agent_name": agent_name,
            "department": department,
            "vendor": vendor,
            "api_endpoint": api_endpoint,
            "requested_model": requested_model,
            "amount": amount,
            "purpose": purpose,
        }

        # 1. Policy Engine
        policy_res = PolicyEngine.evaluate_policies(payload, active_policies)

        # 2. Budget Engine
        budget_res = BudgetEngine.evaluate_budget_cap(
            amount, agent_current_today, agent_daily_budget, agent_current_month, agent_monthly_budget
        )

        # 3. Risk Engine
        risk_res = RiskEngine.evaluate_risk(payload)

        # 4. Cost Optimizer
        cost_rec = CostOptimizer.evaluate_optimization(payload)

        # 5. Approval Tier Determination
        status, approval_tier = ApprovalEngine.determine_approval_tier(amount)

        rejection_reason = None
        if not policy_res["allowed"]:
            if policy_res["action"] == "DENY":
                status = "blocked_by_policy"
                rejection_reason = policy_res["reason"]
            elif policy_res["action"] == "REQUIRE_APPROVAL":
                status = "pending_approval"
        elif budget_res["exceeded"]:
            status = "blocked_by_budget"
            rejection_reason = budget_res["reason"]

        req_id = f"req-{uuid.uuid4().hex[:8]}"
        algo_record = None
        x402_token = None
        x402_status = "BYPASSED"
        api_output = None

        if status == "auto_approved":
            # 6. Algorand Audit Commit
            algo_record = AlgorandService.create_transaction(req_id, amount)

            # 7. x402 Token Issue
            x402_token = f"x402_tok_{int(time.time())}_{uuid.uuid4().hex[:12]}"
            x402_status = "SETTLED"

            # 8. Execute via AI Key Pool Manager
            api_output = await key_pool_manager.execute_with_fallback(
                prompt=purpose, preferred_provider="Gemini", model=requested_model
            )

        result = {
            "id": req_id,
            "agent_id": agent_id,
            "agent_name": agent_name,
            "department": department,
            "vendor": vendor,
            "api_endpoint": api_endpoint,
            "requested_model": requested_model,
            "amount": amount,
            "purpose": purpose,
            "risk_score": risk_res["risk_score"],
            "risk_factors": risk_res["factors"],
            "status": status,
            "approval_tier": approval_tier,
            "rejection_reason": rejection_reason,
            "algorand_tx_hash": algo_record["tx_hash"] if algo_record else None,
            "algorand_block": algo_record["block_number"] if algo_record else None,
            "payload_hash": algo_record["payload_hash"] if algo_record else None,
            "x402_token": x402_token,
            "x402_status": x402_status,
            "recommendation": cost_rec,
            "api_output": api_output
        }

        # Broadcast live event over WebSockets
        await ws_manager.broadcast_event("spend_created", result)

        return result
