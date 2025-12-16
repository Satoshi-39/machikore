/**
 * Network state monitoring
 *
 * Network state management for Offline-First sync
 */

import NetInfo, {
  NetInfoState,
  NetInfoSubscription,
} from '@react-native-community/netinfo';
import { log } from '@/shared/config/logger';

// ===============================
// Type definitions
// ===============================

export type NetworkStatus = 'online' | 'offline' | 'unknown';

export interface NetworkState {
  status: NetworkStatus;
  isInternetReachable: boolean | null;
  type: string | null;
}

// ===============================
// Network state management
// ===============================

let currentNetworkState: NetworkState = {
  status: 'unknown',
  isInternetReachable: null,
  type: null,
};

const listeners: Array<(state: NetworkState) => void> = [];

/**
 * Convert NetInfoState to NetworkState
 */
function netInfoStateToNetworkState(state: NetInfoState): NetworkState {
  const status: NetworkStatus = state.isConnected
    ? 'online'
    : state.isConnected === false
      ? 'offline'
      : 'unknown';

  return {
    status,
    isInternetReachable: state.isInternetReachable,
    type: state.type,
  };
}

/**
 * Notify listeners of network state changes
 */
function notifyListeners(state: NetworkState): void {
  listeners.forEach((listener) => listener(state));
}

/**
 * Start network monitoring
 */
export function startNetworkMonitoring(): NetInfoSubscription {
  return NetInfo.addEventListener((state) => {
    const networkState = netInfoStateToNetworkState(state);

    // Notify only if state has changed
    if (
      networkState.status !== currentNetworkState.status ||
      networkState.isInternetReachable !==
        currentNetworkState.isInternetReachable
    ) {
      log.debug('[Network] State changed:', networkState);
      currentNetworkState = networkState;
      notifyListeners(networkState);
    }
  });
}

/**
 * Get current network state
 */
export async function getNetworkState(): Promise<NetworkState> {
  const state = await NetInfo.fetch();
  const networkState = netInfoStateToNetworkState(state);
  currentNetworkState = networkState;
  return networkState;
}

/**
 * Check if device is online
 *
 * Note: In simulator, isInternetReachable may be null.
 * We treat null as "possibly online" for development.
 */
export async function isOnline(): Promise<boolean> {
  const state = await getNetworkState();
  // Allow null for simulator (treat as online if connected)
  return state.status === 'online' && state.isInternetReachable !== false;
}

/**
 * Add network state change listener
 */
export function addNetworkListener(
  listener: (state: NetworkState) => void
): () => void {
  listeners.push(listener);

  // Return unsubscribe function
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

/**
 * Get current network state synchronously
 * Note: Returns 'unknown' until first fetch completes
 */
export function getCurrentNetworkState(): NetworkState {
  return currentNetworkState;
}
