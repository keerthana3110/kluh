'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AIAgent, PolicyRule, SpendRequest, AlgorandAuditRecord, AIKeyProvider, RequestStatus, ApprovalTier } from '@/types';
import { INITIAL_AGENTS, INITIAL_POLICIES, INITIAL_SPEND_REQUESTS, INITIAL_ALGORAND_RECORDS, INITIAL_AI_PROVIDERS } from './initialData';
import { evaluatePolicy } from './engines/policyEngine';
import { evaluateRisk } from './engines/riskEngine';
import { evaluateCostOptimization } from './engines/costOptimizer';
import { createAlgorandAuditRecord } from './engines/algorandEngine';
import { generateX402Challenge, issueX402Authorization } from './engines/x402Engine';
import { speakAndWait, stopKeynoteVoice } from './engines/voiceNarrator';

interface SimulationState {
  isRunning: boolean;
  currentStep: number;
  stepMessage: string;
  simulatedRequest?: SpendRequest;
}

export interface GovernanceNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'approval' | 'risk' | 'blockchain' | 'key_rotation';
}

interface SentinelContextType {
  isAuthenticated: boolean;
  login: (token?: string) => void;
  logout: () => void;
  currentWorkspace: string;
  setWorkspace: (name: string) => void;
  isVoiceMuted: boolean;
  toggleVoiceMute: () => void;
  agents: AIAgent[];
  policies: PolicyRule[];
  spendRequests: SpendRequest[];
  algorandRecords: AlgorandAuditRecord[];
  aiProviders: AIKeyProvider[];
  notifications: GovernanceNotification[];
  simulation: SimulationState;
  processSpendRequest: (req: Partial<SpendRequest>) => SpendRequest;
  approveSpendRequest: (requestId: string, approvedBy?: string) => void;
  rejectSpendRequest: (requestId: string, reason?: string) => void;
  addAgent: (agent: Omit<AIAgent, 'id' | 'createdAt' | 'currentSpendToday' | 'currentSpendMonth' | 'totalRequests'>) => void;
  addPolicy: (policy: Omit<PolicyRule, 'id' | 'createdAt'>) => void;
  rotateAIKey: (providerName: string) => void;
  runJurySimulation: (presetType?: 'micro_pass' | 'manager_approval' | 'policy_block' | 'high_cost_optimize') => Promise<void>;
  stopJurySimulation: () => void;
  markNotificationsAsRead: () => void;
  resetToDefaults: () => void;
}

const SentinelContext = createContext<SentinelContextType | undefined>(undefined);

export const SentinelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<string>('TechNova Inc.');
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [agents, setAgents] = useState<AIAgent[]>(INITIAL_AGENTS);

  const toggleVoiceMute = () => {
    setIsVoiceMuted(prev => {
      if (!prev) stopKeynoteVoice();
      return !prev;
    });
  };
  const [policies, setPolicies] = useState<PolicyRule[]>(INITIAL_POLICIES);
  const [spendRequests, setSpendRequests] = useState<SpendRequest[]>(INITIAL_SPEND_REQUESTS);
  const [algorandRecords, setAlgorandRecords] = useState<AlgorandAuditRecord[]>(INITIAL_ALGORAND_RECORDS);
  const [aiProviders, setAiProviders] = useState<AIKeyProvider[]>(INITIAL_AI_PROVIDERS);

  const [simulation, setSimulation] = useState<SimulationState>({
    isRunning: false,
    currentStep: 0,
    stepMessage: 'Ready for Spend Request'
  });

  // Check auth state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('sentinel_jwt_token');
      if (token) {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = (token: string = 'demo_jwt_token_auth_verified') => {
    localStorage.setItem('sentinel_jwt_token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('sentinel_jwt_token');
    setIsAuthenticated(false);
  };

  // Load from localStorage if present
  useEffect(() => {
    try {
      const localAgents = localStorage.getItem('sentinel_agents');
      const localPolicies = localStorage.getItem('sentinel_policies');
      const localRequests = localStorage.getItem('sentinel_requests');
      const localAlgo = localStorage.getItem('sentinel_algorand');
      const localProviders = localStorage.getItem('sentinel_providers');

      if (localAgents) setAgents(JSON.parse(localAgents));
      if (localPolicies) setPolicies(JSON.parse(localPolicies));
      if (localRequests) setSpendRequests(JSON.parse(localRequests));
      if (localAlgo) setAlgorandRecords(JSON.parse(localAlgo));
      if (localProviders) setAiProviders(JSON.parse(localProviders));
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('sentinel_agents', JSON.stringify(agents));
      localStorage.setItem('sentinel_policies', JSON.stringify(policies));
      localStorage.setItem('sentinel_requests', JSON.stringify(spendRequests));
      localStorage.setItem('sentinel_algorand', JSON.stringify(algorandRecords));
      localStorage.setItem('sentinel_providers', JSON.stringify(aiProviders));
    } catch (e) {
      console.warn('LocalStorage write error:', e);
    }
  }, [agents, policies, spendRequests, algorandRecords, aiProviders]);

  const processSpendRequest = (req: Partial<SpendRequest>): SpendRequest => {
    const targetAgent = agents.find(a => a.id === req.agentId) || agents[0];
    const amount = req.amount || 10.0;
    const vendor = req.vendor || 'OpenAI';
    const requestedModel = req.requestedModel || 'gpt-4o';
    const purpose = req.purpose || 'Autonomous Agent Task Execution';

    // 1. Evaluate Policy
    const policyResult = evaluatePolicy({ ...req, agentId: targetAgent.id, department: targetAgent.department }, policies, targetAgent);

    // 2. Risk Engine AI
    const riskResult = evaluateRisk(req, targetAgent);

    // 3. Cost Optimizer check
    const costRec = evaluateCostOptimization(req);

    // 4. Approval Tier Determination
    let approvalTier: ApprovalTier = 'None';
    let status: RequestStatus = 'auto_approved';

    if (!policyResult.allowed) {
      if (policyResult.action === 'DENY') {
        status = 'blocked_by_policy';
      } else if (policyResult.action === 'REQUIRE_APPROVAL') {
        status = 'pending_approval';
        if (amount > 1000) approvalTier = 'Executive';
        else if (amount > 100) approvalTier = 'Finance';
        else approvalTier = 'Manager';
      }
    } else {
      // Evaluate budget limit check
      if (targetAgent.currentSpendToday + amount > targetAgent.dailyBudget) {
        status = 'blocked_by_budget';
      } else if (amount > 1000) {
        status = 'pending_approval';
        approvalTier = 'Executive';
      } else if (amount > 100) {
        status = 'pending_approval';
        approvalTier = 'Finance';
      } else if (amount >= 20) {
        status = 'pending_approval';
        approvalTier = 'Manager';
      } else {
        status = 'auto_approved';
      }
    }

    const requestId = `req-${Math.floor(1000 + Math.random() * 9000)}`;
    let algoRecord: AlgorandAuditRecord | undefined;
    let x402Tok: string | undefined;
    let x402Stat: 'CHALLENGED' | 'AUTHORIZED' | 'SETTLED' | 'BYPASSED' = 'BYPASSED';

    if (status === 'auto_approved') {
      // Create Algorand Audit Proof
      algoRecord = createAlgorandAuditRecord(requestId, amount);
      setAlgorandRecords(prev => [algoRecord!, ...prev]);

      // Issue x402 Token
      const challenge = generateX402Challenge(amount);
      const auth = issueX402Authorization(amount, challenge.headers['X-402-Nonce']);
      x402Tok = auth.token;
      x402Stat = 'SETTLED';

      // Update Agent Spend
      setAgents(prev => prev.map(a => a.id === targetAgent.id ? {
        ...a,
        currentSpendToday: Number((a.currentSpendToday + amount).toFixed(2)),
        currentSpendMonth: Number((a.currentSpendMonth + amount).toFixed(2)),
        totalRequests: a.totalRequests + 1
      } : a));
    }

    const newRequest: SpendRequest = {
      id: requestId,
      agentId: targetAgent.id,
      agentName: targetAgent.name,
      department: targetAgent.department,
      vendor,
      apiEndpoint: req.apiEndpoint || `https://api.${vendor.toLowerCase().replace(/\s+/g, '')}.com/v1/execute`,
      requestedModel,
      amount,
      purpose,
      timestamp: new Date().toISOString(),
      riskScore: riskResult.riskScore,
      riskFactors: riskResult.factors,
      status,
      approvalTier,
      recommendation: costRec,
      algorandTxHash: algoRecord?.txHash,
      algorandBlock: algoRecord?.blockNumber,
      payloadHash: algoRecord?.payloadHash,
      x402Token: x402Tok,
      x402Status: x402Stat,
      rejectionReason: status === 'blocked_by_policy' ? policyResult.reason : status === 'blocked_by_budget' ? 'Daily budget limit exceeded' : undefined
    };

    setSpendRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const approveSpendRequest = (requestId: string, approvedBy: string = 'Authorized Manager') => {
    setSpendRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const algoRecord = createAlgorandAuditRecord(requestId, req.amount);
        setAlgorandRecords(aPrev => [algoRecord, ...aPrev]);

        const challenge = generateX402Challenge(req.amount);
        const auth = issueX402Authorization(req.amount, challenge.headers['X-402-Nonce']);

        // Update Agent Spend
        setAgents(agPrev => agPrev.map(a => a.id === req.agentId ? {
          ...a,
          currentSpendToday: Number((a.currentSpendToday + req.amount).toFixed(2)),
          currentSpendMonth: Number((a.currentSpendMonth + req.amount).toFixed(2)),
          totalRequests: a.totalRequests + 1
        } : a));

        return {
          ...req,
          status: 'approved',
          approvedBy,
          algorandTxHash: algoRecord.txHash,
          algorandBlock: algoRecord.blockNumber,
          payloadHash: algoRecord.payloadHash,
          x402Token: auth.token,
          x402Status: 'SETTLED'
        };
      }
      return req;
    }));
  };

  const rejectSpendRequest = (requestId: string, reason: string = 'Rejected by Human Governance Review') => {
    setSpendRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'rejected',
          rejectionReason: reason
        };
      }
      return req;
    }));
  };

  const addAgent = (agentData: Omit<AIAgent, 'id' | 'createdAt' | 'currentSpendToday' | 'currentSpendMonth' | 'totalRequests'>) => {
    const newAgent: AIAgent = {
      ...agentData,
      id: `agent-custom-${Math.floor(100 + Math.random() * 900)}`,
      currentSpendToday: 0.00,
      currentSpendMonth: 0.00,
      totalRequests: 0,
      createdAt: new Date().toISOString()
    };
    setAgents(prev => [...prev, newAgent]);
  };

  const addPolicy = (policyData: Omit<PolicyRule, 'id' | 'createdAt'>) => {
    const newPolicy: PolicyRule = {
      ...policyData,
      id: `pol-${Math.floor(10 + Math.random() * 90)}`,
      createdAt: new Date().toISOString()
    };
    setPolicies(prev => [...prev, newPolicy]);
  };

  const rotateAIKey = (providerName: string) => {
    setAiProviders(prev => prev.map(p => {
      if (p.name.toLowerCase() === providerName.toLowerCase()) {
        const nextIndex = (p.activeKeyIndex + 1) % p.keys.length;
        const updatedKeys = p.keys.map((k, idx) => idx === nextIndex ? { ...k, status: 'healthy' as const, lastRotated: new Date().toISOString() } : k);
        return {
          ...p,
          activeKeyIndex: nextIndex,
          keys: updatedKeys
        };
      }
      return p;
    }));
  };

  const runJurySimulation = async (presetType: 'micro_pass' | 'manager_approval' | 'policy_block' | 'high_cost_optimize' = 'micro_pass') => {
    // Stop any currently playing voice and reset before starting fresh
    stopKeynoteVoice();
    setSimulation({ isRunning: false, currentStep: 0, stepMessage: 'Starting...' });
    await new Promise(r => setTimeout(r, 100)); // brief pause so React state flushes

    // Scenario-specific data
    type ScenarioScript = {
      req: Partial<SpendRequest>;
      steps: string[];
    };

    const scenarios: Record<string, ScenarioScript> = {
      micro_pass: {
        req: {
          agentId: 'agent-dev-02',
          vendor: 'OpenAI',
          requestedModel: 'dall-e-3',
          amount: 15.00,
          purpose: 'Generating social media marketing banner graphics',
        },
        steps: [
          'Welcome to Tracking. In this scenario, a Marketing Agent is initiating a small spend request of just 15 Rupees to use DALL-E 3 for generating social media banner graphics. Every single rupee an AI agent spends flows through our platform.',
          'The spend request has been dispatched over HTTP. Tracking sits in the middle, between the agent and the vendor API, acting as a transparent financial firewall. The request payload is now being received by our Interceptor.',
          'The Policy Engine is now evaluating the request against your organization\'s governance rules. These rules are expressed as an Abstract Syntax Tree, meaning they are composable, auditable, and machine-readable. Checking vendor whitelist... OpenAI is permitted.',
          'The Budget Engine is now checking daily and monthly spending caps. This agent\'s daily limit is set at 500 Rupees. The current daily spend is 127 Rupees. Adding 15 Rupees keeps it safely under the cap. Budget check passed.',
          'The Risk Engine is now computing a multi-factor risk score from zero to one hundred. It evaluates request amount, vendor trust level, agent behavior history, and time of day. This request scores only 12 out of 100. Very low risk.',
          'Because the risk score is below the escalation threshold of 50, no human approval is required. The request is cleared automatically. Our tiered approval system ensures only high-risk or high-value requests escalate to managers.',
          'The Cost Optimizer has scanned for cheaper alternatives. DALL-E 3 at this price point is already competitive. No model swap is recommended. The agent\'s preferred model is approved.',
          'A cryptographic SHA-256 state proof of this transaction is now being committed to the Algorand blockchain. This creates a permanent, tamper-proof audit record that cannot be altered or deleted, ensuring full regulatory compliance.',
          'The x402 Protocol is now issuing a signed payment authorization token. This is a machine-readable HTTP 402 challenge handshake between Tracking and the vendor API, ensuring payment is only released for verified, authorized calls.',
          'The signed token has been dispatched. The OpenAI DALL-E 3 API is now executing the authorized request. The image generation is underway within your approved budget and governance rules.',
          'Workflow complete! The 15 Rupee DALL-E 3 request was automatically approved, executed, and recorded on Algorand. This entire governance cycle took under 2 seconds. That is Tracking â€” full financial control for every AI agent, at any scale.',
        ],
      },
      manager_approval: {
        req: {
          agentId: 'agent-trv-03',
          vendor: 'Amadeus API',
          requestedModel: 'amadeus-flight-v2',
          amount: 116000.00,
          purpose: 'Booking international flight tickets for executive summit',
        },
        steps: [
          'Scenario 2: A Travel Agent is attempting to book international flight tickets for an executive summit. The total spend requested is 1 Lakh and 16 Thousand Rupees. This is a significant financial transaction initiated autonomously by an AI agent.',
          'The 116,000 Rupee spend request has been intercepted by Tracking. Our platform sits transparently in the middle of every AI-to-vendor transaction, capturing the full request context before any money moves.',
          'The Policy AST Engine is evaluating the request. The Amadeus API is on the approved vendor list. The agent has travel booking permissions. However, the amount exceeds the auto-approval threshold. Policy check complete.',
          'The Budget Engine is checking caps. This agent\'s monthly travel budget is 2 Lakh Rupees. Current monthly spend is 84,000 Rupees. Adding 1 Lakh 16 Thousand would push total to 2 Lakh Rupees â€” right at the monthly cap. Budget flagged for review.',
          'The Risk Engine is computing the risk score. High transaction value, proximity to budget cap, and an international vendor combine to produce a risk score of 74 out of 100. This is above the manager escalation threshold.',
          'Risk score of 74 triggers the Human Approval Gate. The system is now routing this request to the designated manager approval queue. The agent will be blocked from proceeding until an authorized human approves or rejects.',
          'The Cost Optimizer has checked alternatives. Amadeus has a discounted fare available 3 days earlier. A 12% cost reduction is possible. This suggestion is included in the manager approval notification for informed decision-making.',
          'An immutable pending record is being written to the Algorand blockchain right now. Even in the pending state, every action is cryptographically logged. The manager\'s approval decision will also be recorded on-chain.',
          'An x402 challenge token has been issued but placed in a HOLD state. The vendor cannot be paid until the human approval resolves. This prevents any unauthorized spend even if the agent retries the request.',
          'The request is now sitting safely in the pending queue. The AI agent is paused. No money has moved. The manager will receive a notification with full context, risk score, budget impact, and the cost optimization suggestion.',
          'Workflow complete with status: PENDING APPROVAL. Tracking has intercepted a 1 Lakh 16 Thousand Rupee autonomous spend and placed it under human control. This is exactly how AI agents should work â€” powerful, but always accountable.',
        ],
      },
      high_cost_optimize: {
        req: {
          agentId: 'agent-dev-02',
          vendor: 'OpenAI',
          requestedModel: 'gpt-5-vision',
          amount: 9600.00,
          purpose: 'Executing complex visual code analysis search',
        },
        steps: [
          'Scenario 3: An Autocode Tracking agent is requesting access to GPT-5 Vision for a complex visual code analysis task. The requested spend is 9,600 Rupees. Tracking is about to intercept and optimize this transaction.',
          'The request payload has been captured. The agent wants GPT-5 Vision from OpenAI. Tracking now has full visibility of the model requested, the vendor, the amount, and the task purpose before any API call is made.',
          'The Policy AST Engine is evaluating the request. OpenAI is an approved vendor. GPT-5 Vision is on the permitted models list. No policy violation detected. However, the system will now check if this model is actually necessary.',
          'Budget Engine check: 9,600 Rupees would consume 64% of this agent\'s monthly budget in a single call. Budget is technically available, but the spend-to-value ratio triggers the Cost Optimization Engine for a deeper analysis.',
          'Risk scoring in progress. The risk score for this request is 61 out of 100. Primary risk factors are the high cost relative to budget and the use of a frontier model for a task that may not require it. Escalating to the optimizer.',
          'Because the risk is elevated but not policy-violating, the Human Approval Gate is bypassed. Instead, the Cost Optimization AI takes over. It will analyze whether a cheaper model can accomplish the same task.',
          'Cost Optimizer analysis complete. The task â€” visual code analysis â€” can be performed with 92% equivalent quality by Gemini 2.5 Flash. The cost drops from 9,600 Rupees to just 768 Rupees. That is a saving of 8,832 Rupees, or 92 percent.',
          'The model swap decision is being committed to the Algorand blockchain. The original GPT-5 Vision request and the optimized Gemini Flash substitution are both recorded, creating a full audit trail of the cost governance decision.',
          'An x402 payment token is being issued for Gemini 2.5 Flash at the new authorized amount of 768 Rupees. The token is signed and cryptographically bound to this specific task and this specific model. No other call can use it.',
          'The Gemini 2.5 Flash API is now executing the visual code analysis with the signed token. The agent receives its result â€” and the organization saves 8,832 Rupees â€” automatically, without any human intervention.',
          'Workflow complete! GPT-5 Vision was swapped to Gemini Flash. The task is done. 8,832 Rupees saved. Multiply this across thousands of daily agent calls and Tracking pays for itself many times over. This is intelligent financial governance.',
        ],
      },
      policy_block: {
        req: {
          agentId: 'agent-hr-05',
          vendor: 'Midjourney API',
          requestedModel: 'midjourney-v6',
          amount: 2000.00,
          purpose: 'Attempting image generation from unauthorized HR bot',
        },
        steps: [
          'Scenario 4: An HR Automation agent has initiated a request to spend 2,000 Rupees on Midjourney Version 6 for image generation. This may seem routine â€” but watch what Tracking does next.',
          'The request has been intercepted. The HR agent is attempting to call the Midjourney API. Tracking has captured the vendor name, model, amount, and agent identity. Every field is being cross-referenced against your governance policies.',
          'The Policy AST Engine is evaluating the rules. Checking vendor whitelist... Midjourney is NOT on the approved vendor list for this organization. Checking agent permissions... HR agents are not authorized to use image generation services. Policy violation detected.',
          'Budget check is irrelevant â€” the policy has already failed. However, Tracking still logs the budget impact of what would have happened if this request had gone through unchecked. 2,000 Rupees would have been wasted.',
          'Risk score: 89 out of 100. The combination of an unauthorized vendor, an out-of-scope model, and an agent attempting to exceed its defined permissions is a critical governance violation. This is exactly the kind of rogue AI behavior Tracking prevents.',
          'The Human Approval Gate does not even activate for policy violations. There is nothing to approve. The request is hard-blocked at the policy layer. No escalation, no override â€” just a clean, immediate stop.',
          'The Cost Optimizer has nothing to do here. This request is blocked entirely. There is no cheaper alternative to evaluate. The agent will not get any model, at any price, because the action itself is not permitted.',
          'A cryptographic BLOCKED record is now being written to the Algorand blockchain with the full violation details â€” agent ID, vendor attempted, amount, timestamp, and the specific policy rule that was violated. This is immutable evidence.',
          'The x402 payment system is returning an HTTP 402 Forbidden response. No payment token is issued. No signed authorization is created. The vendor API will never even receive this request. The payment gateway is sealed.',
          'The HR agent receives a policy violation response. The agent is halted. An alert notification is dispatched to the security team in real time. The incident is fully documented across the audit ledger and the notification feed.',
          'Workflow complete with status: BLOCKED. A potentially costly policy violation by an HR AI agent was caught, stopped, and documented in under 2 seconds. No money moved. No data leaked. No human had to intervene. Tracking just worked.',
        ],
      },
    };

    const scenario = scenarios[presetType] || scenarios.micro_pass;
    const { req: sampleReq, steps } = scenario;

    const speakStep = (text: string) => speakAndWait(text, isVoiceMuted);

    // Step 1
    setSimulation({ isRunning: true, currentStep: 1, stepMessage: `Step 1/11: AI Agent initiating spend request (â‚¹${sampleReq.amount})...` });
    await speakStep(steps[0]);

    // Step 2
    setSimulation(s => ({ ...s, currentStep: 2, stepMessage: 'Step 2/11: Interceptor capturing HTTP request payload...' }));
    await speakStep(steps[1]);

    // Step 3
    setSimulation(s => ({ ...s, currentStep: 3, stepMessage: 'Step 3/11: Spend Policy AST Engine evaluating governance rules...' }));
    await speakStep(steps[2]);

    // Step 4
    setSimulation(s => ({ ...s, currentStep: 4, stepMessage: 'Step 4/11: Budget Engine checking daily & monthly cap allocation...' }));
    await speakStep(steps[3]);

    // Step 5
    setSimulation(s => ({ ...s, currentStep: 5, stepMessage: 'Step 5/11: Risk Engine computing multi-factor AI risk score (0â€“100)...' }));
    await speakStep(steps[4]);

    // Step 6
    setSimulation(s => ({ ...s, currentStep: 6, stepMessage: 'Step 6/11: Human Approval Gate checking escalation thresholds...' }));
    await speakStep(steps[5]);

    // Step 7
    setSimulation(s => ({ ...s, currentStep: 7, stepMessage: 'Step 7/11: Cost Optimization AI scanning for cheaper model alternatives...' }));
    await speakStep(steps[6]);

    // Step 8
    setSimulation(s => ({ ...s, currentStep: 8, stepMessage: 'Step 8/11: Algorand Blockchain committing cryptographic SHA-256 state proof...' }));
    await speakStep(steps[7]);

    // Step 9
    setSimulation(s => ({ ...s, currentStep: 9, stepMessage: 'Step 9/11: x402 Protocol issuing signed HTTP 402 payment authorization token...' }));
    await speakStep(steps[8]);

    // Step 10
    setSimulation(s => ({ ...s, currentStep: 10, stepMessage: 'Step 10/11: Target API Provider executing authorized & verified call...' }));
    await speakStep(steps[9]);

    // Step 11 â€” process and finalize
    const createdReq = processSpendRequest(sampleReq);
    setSimulation({
      isRunning: false,
      currentStep: 11,
      stepMessage: `Step 11/11: âœ… Workflow Complete â€” Status: ${createdReq.status.toUpperCase()}`,
      simulatedRequest: createdReq,
    });
    await speakStep(steps[10]);
  };

  const resetToDefaults = () => {
    setAgents(INITIAL_AGENTS);
    setPolicies(INITIAL_POLICIES);
    setSpendRequests(INITIAL_SPEND_REQUESTS);
    setAlgorandRecords(INITIAL_ALGORAND_RECORDS);
    setAiProviders(INITIAL_AI_PROVIDERS);
    localStorage.clear();
  };

  const [notifications, setNotifications] = useState<GovernanceNotification[]>([
    {
      id: 'notif-1',
      title: 'High Risk Intercepted',
      message: 'Marketing Agent attempted $120.00 spend on gpt-5. Risk Score: 78.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      read: false,
      type: 'risk'
    },
    {
      id: 'notif-2',
      title: 'Algorand State Proof Verified',
      message: 'Transaction TX_ALGO_981A confirmed on Block #3849102.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      read: false,
      type: 'blockchain'
    },
    {
      id: 'notif-3',
      title: 'API Key Pool Rotated',
      message: 'Gemini Key #1 quota exhausted (429). Auto-switched to Key #2.',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      read: true,
      type: 'key_rotation'
    }
  ]);

  const stopJurySimulation = () => {
    setSimulation({
      isRunning: false,
      currentStep: 0,
      stepMessage: 'Ready for Spend Request'
    });
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <SentinelContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      currentWorkspace,
      setWorkspace: setCurrentWorkspace,
      isVoiceMuted,
      toggleVoiceMute,
      agents,
      policies,
      spendRequests,
      algorandRecords,
      aiProviders,
      notifications,
      simulation,
      processSpendRequest,
      approveSpendRequest,
      rejectSpendRequest,
      addAgent,
      addPolicy,
      rotateAIKey,
      runJurySimulation,
      stopJurySimulation,
      markNotificationsAsRead,
      resetToDefaults
    }}>
      {children}
    </SentinelContext.Provider>
  );
};

export const useSentinel = () => {
  const context = useContext(SentinelContext);
  if (!context) {
    throw new Error('useSentinel must be used within a SentinelProvider');
  }
  return context;
};




