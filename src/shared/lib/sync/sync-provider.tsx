/**
 * Sync Provider
 *
 * Provides automatic background sync for the entire app
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useAutoSync } from './use-auto-sync';

interface SyncContextValue {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  error: Error | null;
  triggerSync: () => Promise<void>;
}

const SyncContext = createContext<SyncContextValue | null>(null);

interface SyncProviderProps {
  children: ReactNode;
  enabled?: boolean;
  syncIntervalMs?: number;
}

/**
 * Sync Provider Component
 *
 * Wraps the app to provide automatic background sync
 *
 * @example
 * <SyncProvider enabled={true} syncIntervalMs={60000}>
 *   <App />
 * </SyncProvider>
 */
export function SyncProvider({
  children,
  enabled = true,
  syncIntervalMs = 0, // Manual sync only by default
}: SyncProviderProps) {
  const sync = useAutoSync({
    enabled,
    syncOnMount: true,
    syncOnNetworkRestore: true,
    syncOnAppForeground: true,
    syncIntervalMs,
  });

  return <SyncContext.Provider value={sync}>{children}</SyncContext.Provider>;
}

/**
 * Hook to access sync context
 *
 * @example
 * const { isSyncing, triggerSync } = useSync();
 */
export function useSync(): SyncContextValue {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within SyncProvider');
  }
  return context;
}
