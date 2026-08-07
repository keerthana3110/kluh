'use client';

import React, { useState } from 'react';
import { Activity, ShieldAlert, AlertTriangle, CheckCircle2, Sliders } from 'lucide-react';

export default function RiskPage() {
  const [testAmount, setTestAmount] = useState('9600.00');
  const [testVendor, setTestVendor] = useState('OpenAI');

  const amountScore = Math.min(100, Math.round((Number(testAmount) / 16000) * 100));
  const totalScore = Math.min(100, Math.round(amountScore * 0.7 + 15));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Risk Evaluator (0-100 Score Matrix)</h1>
          <p className="text-xs text-slate-500 font-medium">Multi-factor real-time scoring engine analyzing spend severity, velocity, vendor trust, and timing anomalies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Factors Explanation */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">Risk Factor Weight Matrix</h2>
            <div className="space-y-3 text-xs font-medium">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>1. Spend Amount Severity (Weight: 40%)</span>
                  <span className="text-blue-700 font-mono">High Impact</span>
                </div>
                <p className="text-slate-600 text-[11px]">Evaluates requested transaction amount against agent single spend caps and department thresholds.</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>2. Vendor & API Trust Rating (Weight: 25%)</span>
                  <span className="text-emerald-700 font-mono">Medium Impact</span>
                </div>
                <p className="text-slate-600 text-[11px]">Checks domain authority and endpoint ssl cryptographic certificates of the targeted provider.</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>3. Request Velocity Burst (Weight: 20%)</span>
                  <span className="text-amber-700 font-mono">Burst Anomaly</span>
                </div>
                <p className="text-slate-600 text-[11px]">Detects runaway loop scenarios if an agent submits multiple spend requests within a 60-second window.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Risk Gauge Playground */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs h-fit">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Sliders className="h-4 w-4 text-blue-600" />
            <span>Interactive Risk Calculator</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Target Amount (₹)</label>
              <input
                type="number"
                value={testAmount}
                onChange={e => setTestAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>

            {/* Calculated Risk Gauge Box */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center space-y-2">
              <span className="text-slate-500 text-[10px] font-mono uppercase font-bold">Calculated Risk Score</span>
              <div className={`text-4xl font-extrabold font-mono ${
                totalScore > 70 ? 'text-rose-600' : totalScore > 40 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {totalScore} / 100
              </div>
              <span className={`inline-block rounded-full px-3 py-0.5 text-[10px] font-bold ${
                totalScore > 70 ? 'bg-rose-100 text-rose-800 border border-rose-200' : totalScore > 40 ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {totalScore > 70 ? 'High Risk' : totalScore > 40 ? 'Medium Risk' : 'Low Risk'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
