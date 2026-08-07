'use client';

import React, { useState } from 'react';
import { X, Bot, DollarSign, Send, ShieldAlert, Sparkles } from 'lucide-react';
import { useSentinel } from '@/lib/store';

interface SpendRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpendRequestModal({ isOpen, onClose }: SpendRequestModalProps) {
  const { agents, processSpendRequest } = useSentinel();

  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || '');
  const [vendor, setVendor] = useState('OpenAI');
  const [requestedModel, setRequestedModel] = useState('gpt-4o');
  const [amount, setAmount] = useState('18.50');
  const [purpose, setPurpose] = useState('Generating multi-modal content assets for campaign');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      processSpendRequest({
        agentId: selectedAgentId,
        vendor,
        requestedModel,
        amount: parseFloat(amount) || 10.0,
        purpose,
      });

      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Simulate Agent Spend Request</h3>
              <p className="text-xs text-slate-400">Inject spend event into Sentinel Financial OS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          {/* Agent Selection */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">Target AI Agent</label>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} ({agent.department}) — Limit: ${agent.dailyBudget}/day
                </option>
              ))}
            </select>
          </div>

          {/* Vendor & Model */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">API Vendor</label>
              <select
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                <option value="OpenAI">OpenAI</option>
                <option value="Google Gemini API">Google Gemini API</option>
                <option value="OpenRouter">OpenRouter</option>
                <option value="Anthropic">Anthropic</option>
                <option value="Amadeus API">Amadeus API</option>
                <option value="Midjourney">Midjourney</option>
                <option value="Bloomberg API">Bloomberg API</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Requested Model / API</label>
              <input
                type="text"
                value={requestedModel}
                onChange={(e) => setRequestedModel(e.target.value)}
                placeholder="e.g. gpt-4o, gpt-5, claude-3.5-sonnet"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Spend Amount */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">Spend Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-7 pr-3 py-2 text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Note: &lt;$20 auto-approves. $20-$100 requires Manager. &gt;$100 requires Finance. &gt;$1000 requires Exec.
            </p>
          </div>

          {/* Task Purpose */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">Task Purpose Description</label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none resize-none"
              required
            />
          </div>

          {/* Submit Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-500 transition-all shadow-md shadow-blue-600/30 active:scale-95 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Processing...' : 'Submit Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
