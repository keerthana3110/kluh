import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { SentinelProvider } from '@/lib/store';
import CommandKSearch from '@/components/search/CommandKSearch';
import PresentationMode from '@/components/presentation/PresentationMode';
import AuthGuard from '@/components/auth/AuthGuard';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tracking.ai â€” Financial Operating System for Autonomous AI Agents',
  description: 'Enterprise AI agent spend policy engine with Algorand blockchain state proofs, x402 micropayment authorization, 0-100 risk scoring, and 5-key failover pools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 h-screen overflow-hidden flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900`}>
        <SentinelProvider>
          <AuthGuard>
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                {children}
              </main>
            </div>
            <CommandKSearch />
            <PresentationMode />
          </AuthGuard>
        </SentinelProvider>
      </body>
    </html>
  );
}

