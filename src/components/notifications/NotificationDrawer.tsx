'use client';

import React from 'react';
import { Bell, X, ShieldAlert, CheckCircle2, Blocks, Key, Info } from 'lucide-react';
import { useSentinel } from '@/lib/store';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const { notifications, markNotificationsAsRead } = useSentinel();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white border-l border-slate-200 p-5 shadow-2xl overflow-y-auto space-y-4 animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Bell className="h-4 w-4 text-blue-600" />
            <span>Governance Notifications</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markNotificationsAsRead}
              className="text-[10px] text-blue-600 hover:underline font-medium"
            >
              Mark all read
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Notifications Stream */}
        <div className="space-y-2 text-xs">
          {notifications.length === 0 ? (
            <p className="text-slate-500 text-center py-6">No new notifications.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl border transition-all ${
                  !n.read ? 'border-blue-300 bg-blue-50/60' : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <span>{n.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
