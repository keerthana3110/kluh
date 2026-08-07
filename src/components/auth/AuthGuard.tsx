'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSentinel } from '@/lib/store';

// Routes accessible without authentication
const PUBLIC_ROUTES = ['/', '/login', '/jury-demo'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useSentinel();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isPublic = PUBLIC_ROUTES.includes(pathname);
    const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('sentinel_jwt_token') : false;

    if (!isPublic && !isAuthenticated && !hasToken) {
      router.push('/login');
    }
  }, [pathname, isAuthenticated, router, mounted]);

  return <>{children}</>;
}
