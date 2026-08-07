import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({ title, description, actionText, onAction }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-4 max-w-md mx-auto my-8 shadow-xs">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 border border-blue-200 mx-auto shadow-xs">
        <ShieldCheck className="h-8 w-8 animate-pulse" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
