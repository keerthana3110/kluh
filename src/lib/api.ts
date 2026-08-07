const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function fetchFromBackend<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`Backend fetch fallback on ${endpoint}:`, error);
    return null;
  }
}

export const api = {
  // Auth
  login: (data: any) => fetchFromBackend("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data: any) => fetchFromBackend("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  
  // Agents
  getAgents: () => fetchFromBackend("/agents"),
  createAgent: (data: any) => fetchFromBackend("/agents", { method: "POST", body: JSON.stringify(data) }),
  
  // Policies
  getPolicies: () => fetchFromBackend("/policies"),
  createPolicy: (data: any) => fetchFromBackend("/policies", { method: "POST", body: JSON.stringify(data) }),
  
  // Budgets
  getBudgets: () => fetchFromBackend("/budgets"),
  
  // Spend Requests
  getSpendRequests: () => fetchFromBackend("/spend-request"),
  createSpendRequest: (data: any) => fetchFromBackend("/spend-request", { method: "POST", body: JSON.stringify(data) }),
  
  // Approvals
  getApprovals: () => fetchFromBackend("/approval"),
  processApproval: (data: any) => fetchFromBackend("/approval", { method: "POST", body: JSON.stringify(data) }),
  
  // Analytics & Blockchain
  getAnalytics: () => fetchFromBackend("/analytics"),
  getBlockchainRecords: () => fetchFromBackend("/blockchain"),
  getProvidersStatus: () => fetchFromBackend("/providers"),
  analyzeRisk: (data: any) => fetchFromBackend("/risk-analysis", { method: "POST", body: JSON.stringify(data) }),
};
