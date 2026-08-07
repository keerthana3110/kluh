import { SpendRequest, AIAgent } from '@/types';

export interface RiskEvaluationResult {
  riskScore: number; // 0 to 100
  riskCategory: 'Low' | 'Medium' | 'High' | 'Critical';
  factors: { factor: string; score: number; description: string }[];
}

export function evaluateRisk(
  req: Partial<SpendRequest>,
  agent?: AIAgent,
  recentRequestCountInHour: number = 1
): RiskEvaluationResult {
  const factors: { factor: string; score: number; description: string }[] = [];

  let amountScore = 0;
  const amount = req.amount || 0;
  if (amount > 1000) {
    amountScore = 90;
    factors.push({ factor: 'High Amount Severity', score: 90, description: `Spend amount ($${amount.toFixed(2)}) is extremely large (> $1,000).` });
  } else if (amount > 100) {
    amountScore = 60;
    factors.push({ factor: 'Moderate Spend Severity', score: 60, description: `Spend amount ($${amount.toFixed(2)}) exceeds standard $100 ceiling.` });
  } else if (amount > 20) {
    amountScore = 30;
    factors.push({ factor: 'Standard Spend Limit', score: 30, description: `Spend amount ($${amount.toFixed(2)}) requires routine review.` });
  } else {
    amountScore = 5;
    factors.push({ factor: 'Micro Spend', score: 5, description: 'Micro-transaction under $20 threshold.' });
  }

  // 2. Vendor & Model Risk
  let vendorScore = 10;
  const vendor = (req.vendor || '').toLowerCase();
  const model = (req.requestedModel || '').toLowerCase();

  const trustedVendors = ['openai', 'openrouter', 'google', 'anthropic', 'amadeus', 'bloomberg', 'github', 'perplexity', 'stripe'];
  if (!trustedVendors.some(tv => vendor.includes(tv))) {
    vendorScore = 75;
    factors.push({ factor: 'Untrusted Vendor', score: 75, description: `Vendor '${req.vendor}' is not in corporate primary trusted directory.` });
  } else {
    factors.push({ factor: 'Vendor Verification', score: 10, description: `Vendor '${req.vendor}' is verified.` });
  }

  if (model.includes('gpt-5') || model.includes('opus-4') || model.includes('custom-unrestricted')) {
    vendorScore += 25;
    factors.push({ factor: 'Frontier Experimental Model', score: 85, description: `Model '${req.requestedModel}' is an unverified frontier model.` });
  }

  // 3. Request Velocity Anomaly
  let velocityScore = 0;
  if (recentRequestCountInHour > 20) {
    velocityScore = 85;
    factors.push({ factor: 'Rapid Request Burst', score: 85, description: `High frequency anomaly: ${recentRequestCountInHour} spend requests in past 60 minutes.` });
  } else if (recentRequestCountInHour > 5) {
    velocityScore = 35;
    factors.push({ factor: 'Elevated Velocity', score: 35, description: `${recentRequestCountInHour} requests triggered in recent window.` });
  }

  // 4. Time of day anomaly (Off-hours check 00:00 - 05:00)
  let timeScore = 0;
  const currentHour = new Date().getHours();
  if (currentHour >= 0 && currentHour <= 5) {
    timeScore = 40;
    factors.push({ factor: 'Off-Hours Anomaly', score: 40, description: 'Request initiated during non-standard operational window (12 AM - 5 AM).' });
  }

  // 5. Agent Baseline Risk
  let agentRiskOffset = 0;
  if (agent) {
    if (agent.riskLevel === 'Critical') agentRiskOffset = 30;
    else if (agent.riskLevel === 'High') agentRiskOffset = 20;
    else if (agent.riskLevel === 'Medium') agentRiskOffset = 10;
  }

  // Weighted total risk score calculation
  const totalRaw = (amountScore * 0.4) + (vendorScore * 0.3) + (velocityScore * 0.15) + (timeScore * 0.1) + (agentRiskOffset * 0.05);
  const finalScore = Math.min(100, Math.max(0, Math.round(totalRaw)));

  let riskCategory: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  if (finalScore >= 75) riskCategory = 'Critical';
  else if (finalScore >= 50) riskCategory = 'High';
  else if (finalScore >= 25) riskCategory = 'Medium';

  return {
    riskScore: finalScore,
    riskCategory,
    factors
  };
}
