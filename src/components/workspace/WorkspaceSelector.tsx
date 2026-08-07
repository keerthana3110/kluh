'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ChevronDown, Check, CheckCircle2, User } from 'lucide-react';
import { useSentinel } from '@/lib/store';

export default function WorkspaceSelector() {
  const router = useRouter();
  const { currentWorkspace, setWorkspace } = useSentinel();
  const [isOpen, setIsOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const workspaces = [
    { name: 'TechNova Inc.', plan: 'Enterprise', agents: 12, owner: 'Alex Rivera (Staff Architect)' },
    { name: 'TravelEase Global', plan: 'Growth', agents: 8, owner: 'Marcus Vance (VP Logistics)' },
    { name: 'ShopSphere AI', plan: 'Enterprise', agents: 18, owner: 'Jason Hayes (CMO)' },
    { name: 'HealthAI MedTech', plan: 'Custom HIPAA', agents: 5, owner: 'Dr. Aris Thorne (Chief Compliance)' },
  ];

  const handleSelectWorkspace = (ws: typeof workspaces[0]) => {
    setWorkspace(ws.name);
    setIsOpen(false);
    setToastMsg(`Switched Workspace to ${ws.name} — User context updated to ${ws.owner}`);
    router.refresh();
    setTimeout(() => setToastMsg(''), 3500);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-200 hover:border-slate-300 transition-all shadow-xs"
      >
        <Building2 className="h-4 w-4 text-blue-600" />
        <span>{currentWorkspace}</span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white shadow-xl p-1.5 z-50 text-xs space-y-1 animate-in fade-in duration-200">
          <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase">Select Active Workspace</div>
          {workspaces.map((ws) => (
            <div
              key={ws.name}
              onClick={() => handleSelectWorkspace(ws)}
              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors text-slate-700 ${
                currentWorkspace === ws.name ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-100'
              }`}
            >
              <div>
                <span className="font-bold text-slate-900 block">{ws.name}</span>
                <span className="text-[10px] text-slate-500 block">{ws.plan} • {ws.agents} Agents</span>
                <span className="text-[9.5px] text-blue-700 font-mono flex items-center gap-1 mt-0.5">
                  <User className="h-2.5 w-2.5" />
                  <span>{ws.owner}</span>
                </span>
              </div>
              {currentWorkspace === ws.name && <Check className="h-4 w-4 text-blue-600 shrink-0" />}
            </div>
          ))}
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 shadow-2xl text-xs text-emerald-900 font-bold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
