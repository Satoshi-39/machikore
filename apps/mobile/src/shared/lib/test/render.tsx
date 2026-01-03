/**
 * カスタム render 関数
 * プロバイダーをラップしたテスト用 render
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * テスト用 QueryClient
 * リトライを無効化し、エラーログを抑制
 */
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface WrapperProps {
  children: React.ReactNode;
}

/**
 * テスト用ラッパーコンポーネント
 */
function TestWrapper({ children }: WrapperProps) {
  const queryClient = createTestQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

/**
 * カスタム render 関数
 * QueryClientProvider でラップ
 */
function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: TestWrapper, ...options });
}

// re-export everything
export * from '@testing-library/react-native';

// override render method
export { customRender as render, createTestQueryClient };
