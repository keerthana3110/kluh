'use client';

import React from 'react';
import { Settings, ShieldCheck, Key, Bell, Building2, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organization Governance Settings</h1>
          <p className="text-xs text-slate-500 font-medium">Configure corporate limits, API key pools, Algorand node RPC, and notification preferences</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-6 shadow-xs max-w-2xl">
        <div className="space-y-4 text-xs font-medium">
          <div className="border-b border-slate-200 pb-4 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span>Organization Branding & Limits</span>
            </h2>

            <div>
              <label className="block text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                defaultValue="TechNova Inc."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-bold"
              />
            </div>
          </div>

          <div className="border-b border-slate-200 pb-4 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-600" />
              <span>Algorand Node Configuration</span>
            </h2>

            <div>
              <label className="block text-slate-700 mb-1">Algorand Algod RPC Node Endpoint</label>
              <input
                type="text"
                defaultValue="https://testnet-api.algonode.cloud"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
