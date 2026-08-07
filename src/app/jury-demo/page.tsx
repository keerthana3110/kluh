'use client';

import React from 'react';
import ScenarioBar from '@/components/demo/ScenarioBar';
import WorkflowCanvas from '@/components/demo/WorkflowCanvas';
import AIThinkingPanel from '@/components/demo/AIThinkingPanel';
import ArchitectureInspector from '@/components/demo/ArchitectureInspector';
import BlockchainVisualizer from '@/components/demo/BlockchainVisualizer';
import X402Visualizer from '@/components/demo/X402Visualizer';
import KeyRotationVisualizer from '@/components/demo/KeyRotationVisualizer';
import { useSentinel } from '@/lib/store';
import { Play, Sparkles, Volume2, VolumeX } from 'lucide-react';

export default function JuryDemoPage() {
  const { simulation, runJurySimulation, isVoiceMuted, toggleVoiceMute } = useSentinel();

  return (
    <div className="space-y-8 pb-16">
      {/* Keynote Hero Header */}
      <div className="text-center space-y-4 pt-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-xs">
            <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
            <span>Hackathon Jury Keynote Experience</span>
          </div>

          <button
            onClick={toggleVoiceMute}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all shadow-xs border ${
              !isVoiceMuted ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-100 border-slate-300 text-slate-600'
            }`}
            title="Toggle AI Keynote Voice Narration"
          >
            {!isVoiceMuted ? (
              <>
                <Volume2 className="h-3.5 w-3.5 text-emerald-600 animate-bounce" />
                <span>AI Voice: Active</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5 text-slate-500" />
                <span>AI Voice: Muted</span>
              </>
            )}
          </button>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Watch Autonomous Agent Spending Pass Through <span className="text-gradient-blue font-extrabold">Tracking.ai</span> Live.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
          Select any of the 4 distinct demo scenarios below to watch Tracking.ai authorize, score risk, commit Algorand state proofs, issue x402 micropayment tokens, and execute paid API calls with live AI Voice Narration.
        </p>

        <div className="flex justify-center pt-2">
          <button
            onClick={() => runJurySimulation('micro_pass')}
            disabled={simulation.isRunning}
            className="flex items-center gap-2.5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-blue-600/25 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Launch Live 60-Second Demo</span>
          </button>
        </div>
      </div>

      {/* 4 Hackathon Demo Scenarios */}
      <ScenarioBar />

      {/* Live Interactive Workflow Canvas */}
      <WorkflowCanvas
        currentStep={simulation.currentStep}
        request={simulation.simulatedRequest}
      />

      {/* AI Thinking Stream Panel */}
      <AIThinkingPanel
        currentStep={simulation.currentStep}
        stepMessage={simulation.stepMessage}
        simulatedRequest={simulation.simulatedRequest}
      />

      {/* Visualizers Grid */}
      <div className="grid grid-cols-1 gap-6">
        <BlockchainVisualizer />
        <X402Visualizer />
        <KeyRotationVisualizer />
      </div>

      {/* Interactive Component Architecture Inspector */}
      <ArchitectureInspector />
    </div>
  );
}

