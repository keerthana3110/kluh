import { SpendRequest, PolicyRule, RuleCondition, AIAgent } from '@/types';

export interface PolicyEvaluationResult {
  allowed: boolean;
  action: 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL';
  violatedPolicy?: PolicyRule;
  reason?: string;
}

export function evaluatePolicy(
  request: Partial<SpendRequest>,
  policies: PolicyRule[],
  agent?: AIAgent
): PolicyEvaluationResult {
  // 1. Check Agent Status
  if (agent && agent.status !== 'active') {
    return {
      allowed: false,
      action: 'DENY',
      reason: `Agent '${agent.name}' is currently ${agent.status.toUpperCase()} and cannot initiate spend requests.`
    };
  }

  // 2. Filter Active Policies for Agent / Department
  const activePolicies = policies.filter(p => p.isActive);

  for (const policy of activePolicies) {
    const deptMatch = policy.department === 'All' || policy.department === request.department;
    const agentMatch = policy.agentIds.length === 0 || (request.agentId && policy.agentIds.includes(request.agentId));

    if (deptMatch || agentMatch) {
      // Check hard budget & model caps first
      if (request.amount && request.amount > policy.maxSingleSpend) {
        if (policy.action === 'DENY') {
          return {
            allowed: false,
            action: 'DENY',
            violatedPolicy: policy,
            reason: `Exceeds policy single spend limit ($${request.amount.toFixed(2)} > $${policy.maxSingleSpend.toFixed(2)})`
          };
        } else if (policy.action === 'REQUIRE_APPROVAL') {
          return {
            allowed: false,
            action: 'REQUIRE_APPROVAL',
            violatedPolicy: policy,
            reason: `Amount $${request.amount.toFixed(2)} exceeds threshold ($${policy.maxSingleSpend.toFixed(2)}). Requires approval.`
          };
        }
      }

      // Check denied models
      if (request.requestedModel && policy.deniedModels.some(m => request.requestedModel?.toLowerCase().includes(m.toLowerCase()))) {
        return {
          allowed: false,
          action: 'DENY',
          violatedPolicy: policy,
          reason: `Model '${request.requestedModel}' is explicitly prohibited under policy '${policy.name}'`
        };
      }

      // Evaluate AST condition tree
      const astViolated = evaluateConditionAST(policy.conditionAST, request);
      if (astViolated) {
        if (policy.action === 'DENY') {
          return {
            allowed: false,
            action: 'DENY',
            violatedPolicy: policy,
            reason: `Violates AST rule in policy '${policy.name}'`
          };
        } else if (policy.action === 'REQUIRE_APPROVAL') {
          return {
            allowed: false,
            action: 'REQUIRE_APPROVAL',
            violatedPolicy: policy,
            reason: `Triggered approval rule in policy '${policy.name}'`
          };
        }
      }
    }
  }

  return {
    allowed: true,
    action: 'ALLOW',
    reason: 'Passed all active spend policies.'
  };
}

function evaluateConditionAST(condition: RuleCondition, req: Partial<SpendRequest>): boolean {
  if (!condition) return false;

  const { operator, rules, nested } = condition;

  let ruleResults: boolean[] = [];

  if (rules && rules.length > 0) {
    ruleResults = rules.map(r => {
      let fieldValue: any;
      if (r.field === 'amount') fieldValue = req.amount;
      else if (r.field === 'vendor') fieldValue = req.vendor;
      else if (r.field === 'model') fieldValue = req.requestedModel;
      else if (r.field === 'department') fieldValue = req.department;
      else if (r.field === 'riskScore') fieldValue = req.riskScore;

      if (fieldValue === undefined) return false;

      switch (r.comparison) {
        case 'equals': return String(fieldValue).toLowerCase() === String(r.value).toLowerCase();
        case 'not_equals': return String(fieldValue).toLowerCase() !== String(r.value).toLowerCase();
        case 'greater_than': return Number(fieldValue) > Number(r.value);
        case 'less_than': return Number(fieldValue) < Number(r.value);
        case 'contains': return String(fieldValue).toLowerCase().includes(String(r.value).toLowerCase());
        case 'in': return Array.isArray(r.value) && r.value.includes(fieldValue);
        default: return false;
      }
    });
  }

  if (nested && nested.length > 0) {
    const nestedResults = nested.map(n => evaluateConditionAST(n, req));
    ruleResults = [...ruleResults, ...nestedResults];
  }

  if (ruleResults.length === 0) return false;

  if (operator === 'AND') return ruleResults.every(Boolean);
  if (operator === 'OR') return ruleResults.some(Boolean);
  if (operator === 'NOT') return !ruleResults.every(Boolean);

  return false;
}
