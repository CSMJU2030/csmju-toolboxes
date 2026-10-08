'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { AppShell } from '@/components/shell/app-shell';
import { SessionProvider } from '@/lib/csmju/session';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } } }));

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <AppShell>{children}</AppShell>
      </SessionProvider>
    </QueryClientProvider>
  );
}
