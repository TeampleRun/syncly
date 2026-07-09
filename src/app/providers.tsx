'use client';

// 전역 프로바이더 — tanstack-query 클라이언트를 앱 전체에 제공한다
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Providers({ children }: { children: React.ReactNode }) {
  // 요청 간 캐시가 섞이지 않도록 컴포넌트 수명과 함께 생성한다
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
