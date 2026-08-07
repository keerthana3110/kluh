from typing import List, Dict, Any, Optional


class PolicyEngine:
    """Dynamic Policy AST Evaluator supporting AND, OR, NOT and nested conditions."""

    @staticmethod
    def evaluate_condition_ast(condition: Dict[str, Any], payload: Dict[str, Any]) -> bool:
        if not condition:
            return False

        operator = condition.get("operator", "AND")
        rules = condition.get("rules", [])
        nested = condition.get("nested", [])

        rule_results: List[bool] = []

        for r in rules:
            field_name = r.get("field")
            comparison = r.get("comparison")
            target_value = r.get("value")

            field_val = payload.get(field_name)
            if field_val is None:
                rule_results.append(False)
                continue

            if comparison == "equals":
                res = str(field_val).lower() == str(target_value).lower()
            elif comparison == "not_equals":
                res = str(field_val).lower() != str(target_value).lower()
            elif comparison == "greater_than":
                res = float(field_val) > float(target_value)
            elif comparison == "less_than":
                res = float(field_val) < float(target_value)
            elif comparison == "contains":
                res = str(target_value).lower() in str(field_val).lower()
            elif comparison == "in":
                res = field_val in target_value if isinstance(target_value, list) else False
            else:
                res = False
            
            rule_results.append(res)

        for n in nested:
            rule_results.append(PolicyEngine.evaluate_condition_ast(n, payload))

        if not rule_results:
            return False

        if operator == "AND":
            return all(rule_results)
        elif operator == "OR":
            return any(rule_results)
        elif operator == "NOT":
            return not all(rule_results)

        return False

    @staticmethod
    def evaluate_policies(
        payload: Dict[str, Any],
        active_policies: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Evaluates spend payload against list of active policies.
        Returns evaluation dict with 'allowed', 'action', and 'reason'.
        """
        req_amount = payload.get("amount", 0.0)
        req_model = (payload.get("requested_model") or "").lower()
        req_vendor = (payload.get("vendor") or "").lower()
        req_dept = payload.get("department", "All")

        for policy in active_policies:
            p_dept = policy.get("department", "All")
            if p_dept != "All" and p_dept != req_dept:
                continue

            max_single = policy.get("max_single_spend", 1000.0)
            if req_amount > max_single:
                action = policy.get("action", "REQUIRE_APPROVAL")
                if action == "DENY":
                    return {
                        "allowed": False,
                        "action": "DENY",
                        "violated_policy": policy.get("name"),
                        "reason": f"Amount ${req_amount:.2f} exceeds policy maximum single spend (${max_single:.2f})."
                    }
                elif action == "REQUIRE_APPROVAL":
                    return {
                        "allowed": False,
                        "action": "REQUIRE_APPROVAL",
                        "violated_policy": policy.get("name"),
                        "reason": f"Amount ${req_amount:.2f} requires approval under policy '{policy.get('name')}'."
                    }

            # Check denied models
            denied_models = policy.get("denied_models", [])
            for dm in denied_models:
                if dm.lower() in req_model:
                    return {
                        "allowed": False,
                        "action": "DENY",
                        "violated_policy": policy.get("name"),
                        "reason": f"Model '{req_model}' is prohibited under policy '{policy.get('name')}'."
                    }

            # Check AST condition
            ast = policy.get("condition_ast", {})
            if ast and PolicyEngine.evaluate_condition_ast(ast, payload):
                action = policy.get("action", "DENY")
                return {
                    "allowed": False,
                    "action": action,
                    "violated_policy": policy.get("name"),
                    "reason": f"Triggered AST rule violation in policy '{policy.get('name')}'."
                }

        return {
            "allowed": True,
            "action": "ALLOW",
            "reason": "Passed all spend policies."
        }
