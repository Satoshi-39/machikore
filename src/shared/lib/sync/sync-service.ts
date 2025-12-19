/**
 * Sync Service
 *
 * Handles synchronization between SQLite (local) and Supabase (remote)
 *
 * 現在はvisitsのみを同期対象としています。
 * 他のエンティティを追加する場合は同様のパターンで拡張できます。
 */

import * as SQLiteVisits from '@/shared/api/sqlite/visits';
import * as SupabaseVisits from '@/shared/api/supabase/visits';
import { isOnline } from '@/shared/lib/network/monitor';
import type { SyncResult } from '@/shared/types/sync.types';
import { log } from '@/shared/config/logger';

// ===============================
// State
// ===============================

let isSyncing = false;

// ===============================
// Public API
// ===============================

/**
 * Sync all pending changes
 *
 * @returns Sync result summary
 */
export async function syncAll(): Promise<SyncResult> {
  // Prevent concurrent syncs
  if (isSyncing) {
    log.debug('[Sync] Already in progress, skipping...');
    return {
      success: false,
      syncedCount: 0,
      failedCount: 0,
      errors: [],
    };
  }

  // Check network
  const online = await isOnline();
  if (!online) {
    log.debug('[Sync] Offline, sync skipped');
    return {
      success: false,
      syncedCount: 0,
      failedCount: 0,
      errors: [],
    };
  }

  isSyncing = true;
  log.debug('[Sync] Starting sync...');

  try {
    const result = await syncVisitsToRemote();
    log.info('[Sync] Completed:', result);
    return result;
  } catch (error) {
    log.error('[Sync] Failed:', error);
    return {
      success: false,
      syncedCount: 0,
      failedCount: 0,
      errors: [
        {
          queueId: 'unknown',
          entityType: 'visits',
          entityId: 'unknown',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      ],
    };
  } finally {
    isSyncing = false;
  }
}

/**
 * Get sync status
 */
export function getSyncStatus() {
  const unsyncedVisits = SQLiteVisits.getUnsyncedVisits();

  return {
    isSyncing,
    pendingCount: unsyncedVisits.length,
  };
}

// ===============================
// Private Implementation
// ===============================

async function syncVisitsToRemote(): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    syncedCount: 0,
    failedCount: 0,
    errors: [],
  };

  // Find unsynced visits in local DB
  const unsyncedVisits = SQLiteVisits.getUnsyncedVisits();

  if (unsyncedVisits.length === 0) {
    log.debug('[Sync] No pending sync items');
    return result;
  }

  log.debug(`[Sync] Syncing ${unsyncedVisits.length} visits...`);

  // Sync each visit to Supabase
  for (const visit of unsyncedVisits) {
    try {
      // Create on Supabase
      await SupabaseVisits.createVisit(
        visit.user_id,
        visit.machi_id,
        visit.visited_at
      );

      // Mark as synced in local DB
      SQLiteVisits.markVisitAsSynced(visit.id);
      result.syncedCount++;
      log.debug(`[Sync] Synced visit: ${visit.id}`);
    } catch (error) {
      result.failedCount++;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push({
        queueId: visit.id,
        entityType: 'visits',
        entityId: visit.id,
        error: errorMessage,
      });
      log.error(`[Sync] Failed to sync visit ${visit.id}:`, errorMessage);
    }
  }

  result.success = result.failedCount === 0;
  return result;
}

// ===============================
// Singleton-like accessor (for backward compatibility)
// ===============================

/**
 * @deprecated Use exported functions directly instead
 */
export class SyncService {
  async syncAll() {
    return syncAll();
  }

  async getStatus() {
    return getSyncStatus();
  }
}

let syncServiceInstance: SyncService | null = null;

/**
 * @deprecated Use exported functions directly instead
 */
export function getSyncService(): SyncService {
  if (!syncServiceInstance) {
    syncServiceInstance = new SyncService();
  }
  return syncServiceInstance;
}
