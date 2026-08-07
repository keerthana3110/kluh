'use client';

import React, { useEffect, useState } from 'react';
import { Search, X, Bot, ShieldAlert, Wallet, Blocks, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSentinel } from '@/lib/store';

export default function CommandKSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { agents, policies, spendRequests } = useSentinel();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const filteredAgents = agents.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
  const filteredPolicies = policies.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  const filteredRequests = spendRequests.filter(r => r.vendor.toLowerCase().includes(query.toLowerCase()) || r.agentName.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-slate-200">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search agents, spend policies, requests, or blockchain transactions... (Cmd+K)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent px-3 py-4 text-sm text-slate-900 focus:outline-none placeholder:text-slate-400"
          />
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-3 text-xs">
          {/* Agents */}
          {filteredAgents.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Agents ({filteredAgents.length})</span>
              <div className="space-y-1 mt-1">
                {filteredAgents.map(a => (
                  <div
                    key={a.id}
                    onClick={() => handleSelect('/agents')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors text-slate-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <span className="font-bold text-slate-900">{a.name}</span>
                      <span className="text-[11px] text-slate-500">({a.department})</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Policies */}
          {filteredPolicies.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Spend Policies ({filteredPolicies.length})</span>
              <div className="space-y-1 mt-1">
                {filteredPolicies.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleSelect('/policies')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors text-slate-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="h-4 w-4 text-amber-600" />
                      <span className="font-bold text-slate-900">{p.name}</span>
                      <span className="text-[11px] text-slate-500">({p.action})</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requests */}
          {filteredRequests.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Spend Requests ({filteredRequests.length})</span>
              <div className="space-y-1 mt-1">
                {filteredRequests.slice(0, 3).map(r => (
                  <div
                    key={r.id}
                    onClick={() => handleSelect('/timeline')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors text-slate-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <Wallet className="h-4 w-4 text-emerald-600" />
                      <span className="font-bold text-slate-900">{r.vendor}</span>
                      <span className="font-mono text-emerald-600 font-bold">${r.amount.toFixed(2)}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
