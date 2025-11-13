/**
 * Auto Sync Hook
 *
 * Automatically syncs data when network becomes available
 */

import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { getSyncService } from './sync-service';
import {
  addNetworkListener,
  type NetworkState,
} from '@/shared/lib/network/monitor';

interface AutoSyncOptions {
  enabled?: boolean;
  syncOnMount?: boolean;
  syncOnNetworkRestore?: boolean;
  syncOnAppForeground?: boolean;
  syncIntervalMs?: number; // Auto-sync interval (0 = disabled)
}

const DEFAULT_OPTIONS: AutoSyncOptions = {
  enabled: true,
  syncOnMount: true,
  syncOnNetworkRestore: true,
  syncOnAppForeground: true,
  syncIntervalMs: 0, // Manual sync only by default
};

export function useAutoSync(options: AutoSyncOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const syncService = getSyncService();
  const appState = useRef(AppState.currentState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Manual sync function
  const triggerSync = async () => {
    if (!opts.enabled) return;

    setIsSyncing(true);
    setError(null);

    try {
      const result = await syncService.syncAll();
      setLastSyncTime(new Date());

      if (!result.success && result.errors.length > 0) {
        setError(new Error(`Sync completed with ${result.failedCount} errors`));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Sync failed'));
      console.error('Auto sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Network listener
  useEffect(() => {
    if (!opts.enabled || !opts.syncOnNetworkRestore) return;

    const handleNetworkChange = (state: NetworkState) => {
      // Sync when network is restored
      if (state.status === 'online' && state.isInternetReachable) {
        console.log('📶 Network restored, triggering sync...');
        triggerSync();
      }
    };

    const unsubscribe = addNetworkListener(handleNetworkChange);
    return unsubscribe;
  }, [opts.enabled, opts.syncOnNetworkRestore]);

  // App state listener
  useEffect(() => {
    if (!opts.enabled || !opts.syncOnAppForeground) return;

    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        // Sync when app comes to foreground
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('📱 App foregrounded, triggering sync...');
          triggerSync();
        }
        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [opts.enabled, opts.syncOnAppForeground]);

  // Mount sync
  useEffect(() => {
    if (opts.enabled && opts.syncOnMount) {
      triggerSync();
    }
  }, []); // Only on mount

  // Interval sync
  useEffect(() => {
    if (!opts.enabled || !opts.syncIntervalMs || opts.syncIntervalMs <= 0) {
      return;
    }

    intervalRef.current = setInterval(() => {
      console.log('⏰ Interval sync triggered');
      triggerSync();
    }, opts.syncIntervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [opts.enabled, opts.syncIntervalMs]);

  return {
    isSyncing,
    lastSyncTime,
    error,
    triggerSync,
  };
}
