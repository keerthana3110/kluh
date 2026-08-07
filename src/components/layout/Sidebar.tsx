'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Bot, 
  ShieldAlert, 
  Wallet, 
  Activity, 
  CheckSquare, 
  Zap, 
  Blocks, 
  Key, 
  Clock, 
  PlayCircle, 
  Settings,
  Sparkles,
  TrendingDown,
  BarChart3,
  Cpu,
  FileText,
  LogIn,
  LogOut
} from 'lucide-react';
import { useSentinel } from '@/lib/store';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { spendRequests, isAuthenticated, logout } = useSentinel();

  // Hide sidebar only on full-screen login page or root landing page
  if (pathname === '/login' || pathname === '/') {
    return null;
  }

  const pendingApprovalsCount = spendRequests.filter(r => r.status === 'pending_approval').length;

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Agent Registry', href: '/agents', icon: Bot },
    { name: 'Spend Policies', href: '/policies', icon: ShieldAlert },
    { name: 'Budget Engine', href: '/budgets', icon: Wallet },
    { name: 'Risk Center', href: '/risk', icon: Activity },
    { 
      name: 'Approvals Queue', 
      href: '/approvals', 
      icon: CheckSquare, 
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined 
    },
    { name: 'Cost Optimizer AI', href: '/cost-optimizer', icon: TrendingDown },
    { name: 'Algorand Ledger', href: '/blockchain', icon: Blocks },
    { name: 'x402 Protocol', href: '/x402', icon: Key },
    { name: 'AI Key Resilience', href: '/ai-resilience', icon: Zap },
    { name: 'Spend Timeline', href: '/timeline', icon: Clock },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Provider Status', href: '/providers', icon: Cpu },
    { name: 'Audit Logs', href: '/audit-logs', icon: FileText },
    { name: 'Jury Demo Mode', href: '/jury-demo', icon: PlayCircle, badgeText: 'Live' },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white hidden md:block h-full overflow-y-auto p-4 shadow-xs">
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Financial Control Plane
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700 border border-amber-200 px-1.5">
                      {item.badge}
                    </span>
                  )}

                  {item.badgeText && (
                    <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-700 border border-indigo-200">
                      {item.badgeText}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Auth Action Item */}
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="h-4 w-4 text-rose-500" />
                  <span>Sign Out</span>
                </div>
              </button>
            ) : (
              <Link
                href="/login"
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  pathname === '/login'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LogIn className="h-4 w-4 text-blue-600" />
                  <span>Console Sign-In</span>
                </div>
              </Link>
            )}
          </nav>
        </div>

        {/* Interceptor Status Card */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/60 to-slate-50 p-3.5 text-xs shadow-xs">
          <div className="flex items-center gap-2 text-blue-700 font-bold mb-1">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span>Tracking.ai Interceptor</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
            All AI Agent API outbound requests are routed through Tracking.ai Financial OS.
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200">
            <span>Session Auth:</span>
            <span className={`font-mono font-bold ${isAuthenticated ? 'text-emerald-600' : 'text-amber-600'}`}>
              {isAuthenticated ? 'AUTHENTICATED' : 'GUEST / UNSECURED'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

