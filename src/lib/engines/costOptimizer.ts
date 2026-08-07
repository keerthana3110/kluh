import { SpendRequest, CostRecommendation } from '@/types';

export function evaluateCostOptimization(req: Partial<SpendRequest>): CostRecommendation | undefined {
  const model = (req.requestedModel || '').toLowerCase();
  const amount = req.amount || 0;

  // Rule 1: GPT-5 or GPT-4o requested -> Recommend Gemini 2.0 Flash / Gemini 1.5 Flash
  if (model.includes('gpt-5') || model.includes('gpt-4o')) {
    const recommendedCost = Number((amount * 0.10).toFixed(2));
    const savingsPercent = 90.0;
    return {
      originalModel: req.requestedModel || 'GPT-4o / GPT-5',
      originalVendor: req.vendor || 'OpenAI',
      originalCost: amount,
      recommendedModel: 'gemini-2.0-flash-exp',
      recommendedVendor: 'Google Gemini API',
      recommendedCost: recommendedCost,
      savingsPercent,
      reasoning: 'Google Gemini 2.0 Flash offers sub-second latency and identical reasoning benchmarks at 10% of the cost.'
    };
  }

  // Rule 2: Claude 3.5 Opus -> Recommend DeepSeek-R1 or Claude 3.5 Sonnet
  if (model.includes('opus')) {
    const recommendedCost = Number((amount * 0.20).toFixed(2));
    const savingsPercent = 80.0;
    return {
      originalModel: req.requestedModel || 'Claude 3 Opus',
      originalVendor: req.vendor || 'Anthropic',
      originalCost: amount,
      recommendedModel: 'deepseek-r1-reasoner',
      recommendedVendor: 'OpenRouter',
      recommendedCost: recommendedCost,
      savingsPercent,
      reasoning: 'DeepSeek-R1 handles chain-of-thought code refactoring with superior mathematical accuracy while saving 80% on token fees.'
    };
  }

  // Rule 3: Business Class Flight -> Recommend Premium Economy Flex
  if (model.includes('business-class') || model.includes('first-class')) {
    const recommendedCost = Number((amount * 0.45).toFixed(2));
    const savingsPercent = 55.0;
    return {
      originalModel: req.requestedModel || 'Business Class Flight',
      originalVendor: req.vendor || 'Amadeus API',
      originalCost: amount,
      recommendedModel: 'Premium Economy Flexible',
      recommendedVendor: req.vendor || 'Amadeus API',
      recommendedCost: recommendedCost,
      savingsPercent,
      reasoning: 'Switching to Premium Economy Flexible preserves priority lounge access & full refundability while reducing trip cost by 55%.'
    };
  }

  // Rule 4: DALL-E 3 Heavy Batch -> Recommend Stable Diffusion 3 Turbo
  if (model.includes('dall-e') || model.includes('midjourney')) {
    const recommendedCost = Number((amount * 0.25).toFixed(2));
    const savingsPercent = 75.0;
    return {
      originalModel: req.requestedModel || 'DALL-E 3',
      originalVendor: req.vendor || 'OpenAI',
      originalCost: amount,
      recommendedModel: 'sd3-turbo-fast',
      recommendedVendor: 'Stability AI API',
      recommendedCost: recommendedCost,
      savingsPercent,
      reasoning: 'SD3 Turbo renders high-resolution marketing assets with exact text adherence at 75% reduced cost per generation.'
    };
  }

  return undefined;
}
