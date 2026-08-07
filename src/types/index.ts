export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type ApprovalTier = 'None' | 'Manager' | 'Finance' | 'Executive';
export type RequestStatus = 'auto_approved' | 'pending_approval' | 'approved' | 'rejected' | 'blocked_by_policy' | 'blocked_by_budget';

export interface AIAgent {
  id: string;
  name: string;
  department: string;
  owner: string;
  avatarUrl?: string;
  dailyBudget: number;
  monthlyBudget: number;
  currentSpendToday: number;
  currentSpendMonth: number;
  riskLevel: RiskLevel;
  allowedAPIs: string[];
  status: 'active' | 'paused' | 'blocked';
  totalRequests: number;
  createdAt: string;
}

export interface RuleCondition {
  operator: 'AND' | 'OR' | 'NOT';
  rules?: Array<{
    field: 'amount' | 'vendor' | 'model' | 'department' | 'timeOfDay' | 'riskScore';
    comparison: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in';
    value: any;
  }>;
  nested?: RuleCondition[];
}

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  department: string;
  agentIds: string[];
  action: 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL';
  maxSingleSpend: number;
  maxDailyAmount: number;
  allowedVendors: string[];
  deniedModels: string[];
  conditionAST: RuleCondition;
  isActive: boolean;
  createdAt: string;
}

export interface CostRecommendation {
  originalModel: string;
  originalVendor: string;
  originalCost: number;
  recommendedModel: string;
  recommendedVendor: string;
  recommendedCost: number;
  savingsPercent: number;
  reasoning: string;
}

export interface SpendRequest {
  id: string;
  agentId: string;
  agentName: string;
  department: string;
  vendor: string;
  apiEndpoint: string;
  requestedModel: string;
  amount: number;
  purpose: string;
  timestamp: string;
  riskScore: number; // 0 - 100
  riskFactors: { factor: string; score: number; description: string }[];
  status: RequestStatus;
  approvalTier: ApprovalTier;
  approvedBy?: string;
  rejectionReason?: string;
  algorandTxHash?: string;
  algorandBlock?: number;
  payloadHash?: string;
  x402Token?: string;
  x402Status?: 'CHALLENGED' | 'AUTHORIZED' | 'SETTLED' | 'BYPASSED';
  recommendation?: CostRecommendation;
}

export interface AlgorandAuditRecord {
  txHash: string;
  blockNumber: number;
  timestamp: string;
  senderAddress: string;
  appId: number;
  payloadHash: string;
  policyVersionHash: string;
  stateProof: string;
  verificationStatus: 'VERIFIED' | 'PENDING';
  spendRequestId: string;
  amount: number;
}

export interface AIKeyProvider {
  name: 'Gemini' | 'Grok' | 'OpenRouter' | 'Local Ollama';
  icon: string;
  activeKeyIndex: number;
  totalKeys: number;
  healthScore: number;
  keys: {
    id: string;
    keyMasked: string;
    callsToday: number;
    quotaLimit: number;
    status: 'healthy' | 'warning' | 'cooldown' | 'exhausted';
    lastRotated: string;
  }[];
  fallbackPriority: number;
}
