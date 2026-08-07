'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, Play, Bell, Download, Search, Sparkles, LogOut, UserCheck, Volume2, VolumeX } from 'lucide-react';
import { useSentinel } from '@/lib/store';
import { stopKeynoteVoice } from '@/lib/engines/voiceNarrator';

import WorkspaceSelector from '../workspace/WorkspaceSelector';
import NotificationDrawer from '../notifications/NotificationDrawer';
import ExportModal from '../export/ExportModal';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentWorkspace, notifications, runJurySimulation, simulation, isAuthenticated, logout, isVoiceMuted, toggleVoiceMute } = useSentinel();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const isPublicPage = pathname === '/login' || pathname === '/';

  const activeUserMap: Record<string, { name: string; role: string; initials: string }> = {
    'TechNova Inc.': { name: 'Alex Rivera', role: 'Staff Architect', initials: 'AR' },
    'TravelEase Global': { name: 'Marcus Vance', role: 'VP Logistics', initials: 'MV' },
    'ShopSphere AI': { name: 'Jason Hayes', role: 'CMO', initials: 'JH' },
    'HealthAI MedTech': { name: 'Dr. Aris Thorne', role: 'Chief Compliance', initials: 'AT' },
  };

  const activeUser = activeUserMap[currentWorkspace] || activeUserMap['TechNova Inc.'];

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  const handlePresentToJury = () => {
    stopKeynoteVoice();
    if (pathname !== '/jury-demo') {
      router.push('/jury-demo');
      // Let the page load first, then auto-start — ScenarioBar will handle manual launch
    } else {
      // Already on jury-demo page — fire simulation directly
      runJurySimulation('micro_pass');
    }
  };

  return (
    <>
      <header className="shrink-0 h-16 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md z-40 shadow-xs">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          {/* Left Brand & Workspace Selector */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 border border-blue-500/20 group-hover:border-blue-500 transition-all shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                  Tracking<span className="text-blue-600">.ai</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Financial OS for AI Agents</span>
              </div>
            </Link>

            {!isPublicPage && (
              <>
                <div className="hidden sm:block h-5 w-px bg-slate-200" />
                <div className="hidden sm:block">
                  <WorkspaceSelector />
                </div>
              </>
            )}
          </div>

          {/* Right Action Trigger Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isPublicPage && (
              <>
                {/* Active User Avatar Badge */}
                <div className="hidden md:flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs shadow-xs">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-[10px]">
                    {activeUser.initials}
                  </div>
                  <div className="flex flex-col text-[11px] leading-tight">
                    <span className="font-bold text-slate-900">{activeUser.name}</span>
                    <span className="text-[9px] text-slate-500 font-mono">{activeUser.role}</span>
                  </div>
                </div>

                {/* Cmd+K Search trigger */}
                <div
                  className="hidden lg:flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs text-slate-600 cursor-pointer hover:border-slate-300 transition-all"
                  onClick={() => {
                    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
                    window.dispatchEvent(event);
                  }}
                >
                  <Search className="h-3.5 w-3.5 text-slate-500" />
                  <span>Quick Search...</span>
                  <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-mono text-slate-700">⌘K</kbd>
                </div>

                {/* Export Reports */}
                <button
                  onClick={() => setIsExportOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 hover:border-slate-300 transition-all shadow-xs"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Export</span>
                </button>

                {/* Notifications */}
                <button
                  onClick={() => setIsNotifOpen(true)}
                  className="relative rounded-xl bg-slate-100 border border-slate-200 p-2 text-slate-700 hover:bg-slate-200 hover:border-slate-300 transition-all shadow-xs"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* AI Voice Toggle */}
            <button
              onClick={toggleVoiceMute}
              className={`rounded-xl p-2 transition-all shadow-xs border ${
                !isVoiceMuted ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}
              title={!isVoiceMuted ? 'Mute AI Keynote Narration Voice' : 'Unmute AI Keynote Narration Voice'}
            >
              {!isVoiceMuted ? <Volume2 className="h-4 w-4 text-emerald-600" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
            </button>

            {/* Auth Action */}
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all shadow-xs"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              pathname !== '/login' && (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all shadow-xs"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Console Sign-In</span>
                </Link>
              )
            )}

            {/* Hackathon Jury Keynote Trigger */}
            <button
              onClick={handlePresentToJury}
              disabled={simulation.isRunning}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Present to Jury</span>
            </button>
          </div>
        </div>
      </header>

      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </>
  );
}
