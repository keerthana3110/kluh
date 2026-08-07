import { AIAgent, PolicyRule, SpendRequest, AlgorandAuditRecord, AIKeyProvider } from '@/types';

export const INITIAL_AGENTS: AIAgent[] = [
  {
    id: 'agent-mkt-01',
    name: 'Growth Marketing Agent',
    department: 'Marketing',
    owner: 'Sarah Connor (Head of Growth)',
    dailyBudget: 4000.00,
    monthlyBudget: 100000.00,
    currentSpendToday: 1480.50,
    currentSpendMonth: 38400.20,
    riskLevel: 'Medium',
    allowedAPIs: ['DALL-E 3', 'Midjourney API', 'OpenAI GPT-4o', 'Twitter API'],
    status: 'active',
    totalRequests: 142,
    createdAt: '2026-07-15T09:00:00Z',
  },
  {
    id: 'agent-dev-02',
    name: 'Autocode Sentinel',
    department: 'Coding',
    owner: 'Alex Rivera (Staff Architect)',
    dailyBudget: 12000.00,
    monthlyBudget: 300000.00,
    currentSpendToday: 3360.10,
    currentSpendMonth: 151200.00,
    riskLevel: 'Low',
    allowedAPIs: ['OpenRouter', 'Gemini Flash', 'GitHub Copilot Enterprise', 'Anthropic Claude 3.5'],
    status: 'active',
    totalRequests: 890,
    createdAt: '2026-07-10T14:30:00Z',
  },
  {
    id: 'agent-trv-03',
    name: 'Corporate Travel Agent',
    department: 'Travel',
    owner: 'David Kim (Operations VP)',
    dailyBudget: 40000.00,
    monthlyBudget: 800000.00,
    currentSpendToday: 0.00,
    currentSpendMonth: 276000.00,
    riskLevel: 'High',
    allowedAPIs: ['Amadeus API', 'Expedia Partner Network', 'Uber Business'],
    status: 'active',
    totalRequests: 34,
    createdAt: '2026-07-18T11:15:00Z',
  },
  {
    id: 'agent-res-04',
    name: 'Deep Research Agent',
    department: 'Research',
    owner: 'Elena Rostova (Lead Data Scientist)',
    dailyBudget: 6500.00,
    monthlyBudget: 160000.00,
    currentSpendToday: 990.40,
    currentSpendMonth: 56800.00,
    riskLevel: 'Low',
    allowedAPIs: ['Perplexity Pro API', 'Semantic Scholar API', 'PubMed E-Utilities', 'ArXiv Search'],
    status: 'active',
    totalRequests: 312,
    createdAt: '2026-07-22T08:00:00Z',
  },
  {
    id: 'agent-hr-05',
    name: 'People Operations Bot',
    department: 'HR',
    owner: 'Marcus Vance (HR Director)',
    dailyBudget: 2500.00,
    monthlyBudget: 50000.00,
    currentSpendToday: 415.20,
    currentSpendMonth: 11600.00,
    riskLevel: 'Low',
    allowedAPIs: ['Greenhouse API', 'LinkedIn Talent API', 'Slack API'],
    status: 'active',
    totalRequests: 88,
    createdAt: '2026-07-25T16:00:00Z',
  },
  {
    id: 'agent-fin-06',
    name: 'Quant Treasury Agent',
    department: 'Finance',
    owner: 'Elena Rostova (CFO)',
    dailyBudget: 80000.00,
    monthlyBudget: 2000000.00,
    currentSpendToday: 14800.00,
    currentSpendMonth: 992000.00,
    riskLevel: 'Critical',
    allowedAPIs: ['Bloomberg Terminal API', 'Stripe Financial Connections', 'Algorand Indexer'],
    status: 'active',
    totalRequests: 520,
    createdAt: '2026-07-01T10:00:00Z',
  }
];

export const INITIAL_POLICIES: PolicyRule[] = [
  {
    id: 'pol-01',
    name: 'Marketing API Spending Cap',
    description: 'Enforces maximum ₹1,500/day single spend limit for Marketing agents and bans unapproved image APIs.',
    department: 'Marketing',
    agentIds: ['agent-mkt-01'],
    action: 'REQUIRE_APPROVAL',
    maxSingleSpend: 1500.00,
    maxDailyAmount: 4000.00,
    allowedVendors: ['OpenAI', 'Midjourney', 'Twitter'],
    deniedModels: ['GPT-5', 'DALL-E 4-Ultra'],
    conditionAST: {
      operator: 'AND',
      rules: [
        { field: 'department', comparison: 'equals', value: 'Marketing' },
        { field: 'amount', comparison: 'greater_than', value: 1500.00 }
      ]
    },
    isActive: true,
    createdAt: '2026-07-16T10:00:00Z',
  },
  {
    id: 'pol-02',
    name: 'Coding Agent Frontier Model Ban',
    description: 'Allows OpenRouter and Gemini Flash. Strictly denies GPT-5 or unmonitored expensive LLM endpoints.',
    department: 'Coding',
    agentIds: ['agent-dev-02'],
    action: 'DENY',
    maxSingleSpend: 4000.00,
    maxDailyAmount: 12000.00,
    allowedVendors: ['OpenRouter', 'Google', 'Anthropic'],
    deniedModels: ['GPT-5', 'GPT-5-Turbo', 'Claude-4-Opus'],
    conditionAST: {
      operator: 'OR',
      rules: [
        { field: 'model', comparison: 'equals', value: 'GPT-5' },
        { field: 'model', comparison: 'equals', value: 'GPT-5-Turbo' }
      ]
    },
    isActive: true,
    createdAt: '2026-07-12T11:20:00Z',
  },
  {
    id: 'pol-03',
    name: 'Travel Luxury Tier Restriction',
    description: 'Blocks Business Class or First Class airfare bookings from automated Travel Agents.',
    department: 'Travel',
    agentIds: ['agent-trv-03'],
    action: 'DENY',
    maxSingleSpend: 20000.00,
    maxDailyAmount: 40000.00,
    allowedVendors: ['Amadeus', 'Expedia'],
    deniedModels: ['Business-Class-Booking', 'First-Class-Suite'],
    conditionAST: {
      operator: 'AND',
      rules: [
        { field: 'department', comparison: 'equals', value: 'Travel' },
        { field: 'amount', comparison: 'greater_than', value: 20000.00 }
      ]
    },
    isActive: true,
    createdAt: '2026-07-20T09:45:00Z',
  },
  {
    id: 'pol-04',
    name: 'HR Generative Image API Block',
    description: 'Prevents HR Agents from spending funds on paid image generation or design APIs.',
    department: 'HR',
    agentIds: ['agent-hr-05'],
    action: 'DENY',
    maxSingleSpend: 400.00,
    maxDailyAmount: 2500.00,
    allowedVendors: ['Greenhouse', 'LinkedIn'],
    deniedModels: ['DALL-E 3', 'Midjourney API', 'Stable Diffusion 3'],
    conditionAST: {
      operator: 'AND',
      rules: [
        { field: 'department', comparison: 'equals', value: 'HR' },
        { field: 'vendor', comparison: 'equals', value: 'Midjourney' }
      ]
    },
    isActive: true,
    createdAt: '2026-07-26T14:10:00Z',
  }
];

export const INITIAL_SPEND_REQUESTS: SpendRequest[] = [
  {
    id: 'req-9081',
    agentId: 'agent-dev-02',
    agentName: 'Autocode Sentinel',
    department: 'Coding',
    vendor: 'OpenRouter',
    apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
    requestedModel: 'anthropic/claude-3.5-sonnet',
    amount: 11.20,
    purpose: 'Refactoring auth middleware & AST parsing logic',
    timestamp: '2026-08-07T16:25:10Z',
    riskScore: 12,
    riskFactors: [
      { factor: 'Vendor Trust', score: 5, description: 'OpenRouter is a verified trusted vendor' },
      { factor: 'Amount Anomaly', score: 2, description: 'Micro-transaction under ₹80 threshold' },
      { factor: 'Time Window', score: 5, description: 'Normal operating business hours' }
    ],
    status: 'auto_approved',
    approvalTier: 'None',
    algorandTxHash: 'TX_ALGO_7F89A2BC34DE0192',
    algorandBlock: 3849102,
    payloadHash: 'a8b9c7d6e5f41234567890abcdef1234567890abcdef1234567890abcdef1234',
    x402Token: 'x402_tok_9081_verified_sig_78a12b',
    x402Status: 'SETTLED',
  },
  {
    id: 'req-9082',
    agentId: 'agent-trv-03',
    agentName: 'Corporate Travel Agent',
    department: 'Travel',
    vendor: 'Amadeus API',
    apiEndpoint: 'https://api.amadeus.com/v1/shopping/flight-offers',
    requestedModel: 'Flight-Booking-Business-Class',
    amount: 116000.00,
    purpose: 'Executive flight booking to AI Summit San Francisco',
    timestamp: '2026-08-07T16:18:40Z',
    riskScore: 78,
    riskFactors: [
      { factor: 'High Spend Severity', score: 85, description: 'Amount exceeds ₹80,000 threshold (₹1,16,000.00)' },
      { factor: 'Policy Violation Flag', score: 70, description: 'Matches Business Class travel policy flag' },
      { factor: 'Frequency Velocity', score: 40, description: '2nd high-value request in 1 hour' }
    ],
    status: 'pending_approval',
    approvalTier: 'Executive',
    recommendation: {
      originalModel: 'Business Class Flight',
      originalVendor: 'Amadeus API',
      originalCost: 116000.00,
      recommendedModel: 'Premium Economy Flex',
      recommendedVendor: 'Amadeus API',
      recommendedCost: 54400.00,
      savingsPercent: 53.1,
      reasoning: 'Switching to Premium Economy Flex saves ₹61,600.00 while maintaining priority check-in and refundable status.'
    }
  },
  {
    id: 'req-9083',
    agentId: 'agent-mkt-01',
    agentName: 'Growth Marketing Agent',
    department: 'Marketing',
    vendor: 'OpenAI',
    apiEndpoint: 'https://api.openai.com/v1/images/generations',
    requestedModel: 'gpt-5-vision',
    amount: 3600.00,
    purpose: 'Generating 20 social media campaign banner variants',
    timestamp: '2026-08-07T16:05:12Z',
    riskScore: 42,
    riskFactors: [
      { factor: 'Amount Severity', score: 45, description: 'Amount exceeds ₹1,500 auto-approval limit (₹3,600.00)' },
      { factor: 'Frontier Model', score: 40, description: 'Requested model gpt-5-vision is in restricted evaluation tier' }
    ],
    status: 'pending_approval',
    approvalTier: 'Manager',
    recommendation: {
      originalModel: 'gpt-5-vision',
      originalVendor: 'OpenAI',
      originalCost: 3600.00,
      recommendedModel: 'gemini-2.0-flash-exp',
      recommendedVendor: 'Google Gemini API',
      recommendedCost: 360.00,
      savingsPercent: 90.0,
      reasoning: 'Gemini 2.0 Flash handles multimodal image batch generation at 1/10th the cost with identical visual fidelity.'
    }
  },
  {
    id: 'req-9084',
    agentId: 'agent-hr-05',
    agentName: 'People Operations Bot',
    department: 'HR',
    vendor: 'Midjourney',
    apiEndpoint: 'https://api.midjourney.com/v2/imagine',
    requestedModel: 'Midjourney API v6',
    amount: 2240.00,
    purpose: 'Generating team avatar illustrations',
    timestamp: '2026-08-07T15:40:00Z',
    riskScore: 92,
    riskFactors: [
      { factor: 'Policy AST Violation', score: 95, description: 'HR Department policy explicitly forbids image generation APIs' },
      { factor: 'Unauthorized Vendor', score: 88, description: 'Midjourney is not in HR API whitelist' }
    ],
    status: 'blocked_by_policy',
    approvalTier: 'None',
    rejectionReason: 'Blocked by Policy #pol-04 (HR Generative Image API Block).'
  },
  {
    id: 'req-9085',
    agentId: 'agent-fin-06',
    agentName: 'Quant Treasury Agent',
    department: 'Finance',
    vendor: 'Bloomberg API',
    apiEndpoint: 'https://api.bloomberg.com/v1/data/snapshot',
    requestedModel: 'Bloomberg-Realtime-Feed',
    amount: 14800.00,
    purpose: 'Real-time market depth analysis for hedging reserves',
    timestamp: '2026-08-07T15:10:22Z',
    riskScore: 25,
    riskFactors: [
      { factor: 'Authorized Vendor', score: 10, description: 'Bloomberg is a whitelisted Finance API vendor' },
      { factor: 'Budget Threshold', score: 35, description: 'Amount is within Finance daily budget cap (₹80,000)' }
    ],
    status: 'approved',
    approvalTier: 'Finance',
    approvedBy: 'Elena Rostova (CFO)',
    algorandTxHash: 'TX_ALGO_91B28C74D01E49A1',
    algorandBlock: 3849080,
    payloadHash: 'b9c8d7e6f5a432109876543210fedcba9876543210fedcba9876543210fedcba',
    x402Token: 'x402_tok_9085_verified_sig_99a88c',
    x402Status: 'SETTLED'
  }
];

export const INITIAL_ALGORAND_RECORDS: AlgorandAuditRecord[] = [
  {
    txHash: 'TX_ALGO_7F89A2BC34DE0192',
    blockNumber: 3849102,
    timestamp: '2026-08-07T16:25:10Z',
    senderAddress: 'SENTINEL_GOV_ALGO_ADDR_89234X9123847',
    appId: 1049283,
    payloadHash: 'a8b9c7d6e5f41234567890abcdef1234567890abcdef1234567890abcdef1234',
    policyVersionHash: 'POL_VER_HASH_2026_08_01_v4_8912',
    stateProof: 'ALGO_ZKPROOF_VERIFIED_SIGNATURE_0x99281734918237',
    verificationStatus: 'VERIFIED',
    spendRequestId: 'req-9081',
    amount: 11.20
  },
  {
    txHash: 'TX_ALGO_91B28C74D01E49A1',
    blockNumber: 3849080,
    timestamp: '2026-08-07T15:10:22Z',
    senderAddress: 'SENTINEL_GOV_ALGO_ADDR_89234X9123847',
    appId: 1049283,
    payloadHash: 'b9c8d7e6f5a432109876543210fedcba9876543210fedcba9876543210fedcba',
    policyVersionHash: 'POL_VER_HASH_2026_08_01_v4_8912',
    stateProof: 'ALGO_ZKPROOF_VERIFIED_SIGNATURE_0x88371947291823',
    verificationStatus: 'VERIFIED',
    spendRequestId: 'req-9085',
    amount: 14800.00
  }
];

export const INITIAL_AI_PROVIDERS: AIKeyProvider[] = [
  {
    name: 'Gemini',
    icon: 'Sparkles',
    activeKeyIndex: 0,
    totalKeys: 5,
    healthScore: 100,
    fallbackPriority: 1,
    keys: [
      { id: 'gemini-key-1', keyMasked: 'AIzaSyD-89...x92A', callsToday: 1420, quotaLimit: 5000, status: 'healthy', lastRotated: '2026-08-07T14:00:00Z' },
      { id: 'gemini-key-2', keyMasked: 'AIzaSyB-71...p44K', callsToday: 890, quotaLimit: 5000, status: 'healthy', lastRotated: '2026-08-07T12:30:00Z' },
      { id: 'gemini-key-3', keyMasked: 'AIzaSyC-99...m11L', callsToday: 4900, quotaLimit: 5000, status: 'warning', lastRotated: '2026-08-06T18:00:00Z' },
      { id: 'gemini-key-4', keyMasked: 'AIzaSyE-55...r88P', callsToday: 0, quotaLimit: 5000, status: 'healthy', lastRotated: '2026-08-05T09:00:00Z' },
      { id: 'gemini-key-5', keyMasked: 'AIzaSyF-33...v22Q', callsToday: 0, quotaLimit: 5000, status: 'healthy', lastRotated: '2026-08-05T09:00:00Z' }
    ]
  },
  {
    name: 'Grok',
    icon: 'Cpu',
    activeKeyIndex: 0,
    totalKeys: 5,
    healthScore: 98,
    fallbackPriority: 2,
    keys: [
      { id: 'grok-key-1', keyMasked: 'xai-89123...a911', callsToday: 450, quotaLimit: 3000, status: 'healthy', lastRotated: '2026-08-07T11:00:00Z' },
      { id: 'grok-key-2', keyMasked: 'xai-77234...b882', callsToday: 320, quotaLimit: 3000, status: 'healthy', lastRotated: '2026-08-07T09:00:00Z' },
      { id: 'grok-key-3', keyMasked: 'xai-55111...c333', callsToday: 0, quotaLimit: 3000, status: 'healthy', lastRotated: '2026-08-04T10:00:00Z' },
      { id: 'grok-key-4', keyMasked: 'xai-22444...d444', callsToday: 0, quotaLimit: 3000, status: 'healthy', lastRotated: '2026-08-04T10:00:00Z' },
      { id: 'grok-key-5', keyMasked: 'xai-99888...e555', callsToday: 0, quotaLimit: 3000, status: 'healthy', lastRotated: '2026-08-04T10:00:00Z' }
    ]
  },
  {
    name: 'OpenRouter',
    icon: 'Globe',
    activeKeyIndex: 0,
    totalKeys: 5,
    healthScore: 95,
    fallbackPriority: 3,
    keys: [
      { id: 'or-key-1', keyMasked: 'sk-or-v1-9981...11aa', callsToday: 2100, quotaLimit: 10000, status: 'healthy', lastRotated: '2026-08-07T15:00:00Z' },
      { id: 'or-key-2', keyMasked: 'sk-or-v1-7762...22bb', callsToday: 1500, quotaLimit: 10000, status: 'healthy', lastRotated: '2026-08-07T13:00:00Z' },
      { id: 'or-key-3', keyMasked: 'sk-or-v1-4431...33cc', callsToday: 800, quotaLimit: 10000, status: 'healthy', lastRotated: '2026-08-06T10:00:00Z' },
      { id: 'or-key-4', keyMasked: 'sk-or-v1-1122...44dd', callsToday: 0, quotaLimit: 10000, status: 'healthy', lastRotated: '2026-08-05T08:00:00Z' },
      { id: 'or-key-5', keyMasked: 'sk-or-v1-5566...55ee', callsToday: 0, quotaLimit: 10000, status: 'healthy', lastRotated: '2026-08-05T08:00:00Z' }
    ]
  },
  {
    name: 'Local Ollama',
    icon: 'HardDrive',
    activeKeyIndex: 0,
    totalKeys: 1,
    healthScore: 100,
    fallbackPriority: 4,
    keys: [
      { id: 'ollama-local-1', keyMasked: 'http://localhost:11434', callsToday: 42, quotaLimit: 999999, status: 'healthy', lastRotated: '2026-08-01T00:00:00Z' }
    ]
  }
];
