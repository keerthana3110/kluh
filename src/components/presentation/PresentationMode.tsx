'use client';

import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipForward, RotateCcw, X, Sparkles, ChevronRight, ChevronLeft, Volume2 } from 'lucide-react';
import { useSentinel } from '@/lib/store';
import WorkflowCanvas from '../demo/WorkflowCanvas';
import AIThinkingPanel from '../demo/AIThinkingPanel';

export default function PresentationMode() {
  const { simulation, runJurySimulation, stopJurySimulation } = useSentinel();
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);

  const scenarioIds = ['micro_pass', 'manager_approval', 'high_cost_optimize', 'policy_block'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopJurySimulation();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        const nextIdx = (activeScenarioIndex + 1) % scenarioIds.length;
        setActiveScenarioIndex(nextIdx);
        runJurySimulation(scenarioIds[nextIdx] as any);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIdx = (activeScenarioIndex - 1 + scenarioIds.length) % scenarioIds.length;
        setActiveScenarioIndex(prevIdx);
        runJurySimulation(scenarioIds[prevIdx] as any);
      }
    };

    if (simulation.isRunning) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [simulation.isRunning, activeScenarioIndex]);

  if (!simulation.isRunning) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex flex-col justify-between p-6 animate-in fade-in duration-300">
      {/* Top Presentation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/95 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shadow-xs">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Tracking.ai â€” Hackathon Keynote Mode</h2>
            <p className="text-xs text-slate-500 font-mono">Use Arrow Keys (â† / â†’) or Spacebar to navigate live scenarios</p>
          </div>
        </div>

        <button
          onClick={stopJurySimulation}
          className="flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-rose-600 hover:text-white transition-all shadow-xs"
        >
          <X className="h-4 w-4" />
          <span>Exit Keynote Mode (Esc)</span>
        </button>
      </div>

      {/* Main Presentation Stage */}
      <div className="my-auto max-w-5xl mx-auto w-full space-y-6">
        <WorkflowCanvas
          currentStep={simulation.currentStep}
          request={simulation.simulatedRequest}
        />

        <AIThinkingPanel
          currentStep={simulation.currentStep}
          stepMessage={simulation.stepMessage}
          simulatedRequest={simulation.simulatedRequest}
        />
      </div>

      {/* Bottom Keynote Controller HUD */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white shadow-xl max-w-2xl mx-auto w-full flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const prevIdx = (activeScenarioIndex - 1 + scenarioIds.length) % scenarioIds.length;
              setActiveScenarioIndex(prevIdx);
              runJurySimulation(scenarioIds[prevIdx] as any);
            }}
            className="rounded-lg bg-slate-100 border border-slate-200 p-2 text-slate-700 hover:bg-slate-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-slate-700 font-bold">
            Scenario {activeScenarioIndex + 1} of {scenarioIds.length}
          </span>
          <button
            onClick={() => {
              const nextIdx = (activeScenarioIndex + 1) % scenarioIds.length;
              setActiveScenarioIndex(nextIdx);
              runJurySimulation(scenarioIds[nextIdx] as any);
            }}
            className="rounded-lg bg-slate-100 border border-slate-200 p-2 text-slate-700 hover:bg-slate-200"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
          <span>Shortcuts:</span>
          <kbd className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-slate-700 font-bold">Space</kbd> Next
          <kbd className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-slate-700 font-bold">Esc</kbd> Exit
        </div>
      </div>
    </div>
  );
}

