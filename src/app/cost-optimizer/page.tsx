'use client';

import React from 'react';
import { TrendingDown, Sparkles, Zap, DollarSign, ArrowRight } from 'lucide-react';

export default function CostOptimizerPage() {
  const recommendations = [
    {
      requested: 'GPT-4o ($0.03/1k tokens)',
      recommended: 'Gemini 2.0 Flash ($0.003/1k tokens)',
      savings: '90.0%',
      desc: 'Automatic swap for image recognition benchmarks'
    },
    {
      requested: 'Claude 3.5 Sonnet ($0.015/1k tokens)',
      recommended: 'DeepSeek V3 ($0.002/1k tokens)',
      savings: '86.6%',
      desc: 'Code synthesis optimization for background tasks'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Frontier Cost Optimizer AI</h1>
          <p className="text-xs text-slate-500 font-medium">Intercepts high-cost model requests and automatically recommends lower-cost equivalent providers</p>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl border border-blue-200 bg-white space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
                <span>Smart Model Swap Recommendation</span>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                Save {rec.savings}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center">
                <span className="text-slate-500 font-sans">Requested:</span>
                <span className="text-rose-600 font-bold">{rec.requested}</span>
              </div>

              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 flex justify-between items-center">
                <span className="text-emerald-800 font-sans font-bold">Recommended:</span>
                <span className="text-emerald-700 font-bold">{rec.recommended}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">{rec.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
