/**
 * Sync Service
 *
 * Handles synchronization between SQLite (local) and Supabase (remote)
 */

import { SQLiteSyncQueueRepository } from '@/shared/api/repositories/sqlite/sync-queue.repository';
import { SQLiteVisitRepository } from '@/shared/api/repositories/sqlite/visit.repository';
import { SupabaseVisitRepository } from '@/shared/api/repositories/supabase/visit.repository';
import { isOnline } from '@/shared/lib/network/monitor';
import type { SyncResult } from '@/shared/types/sync.types';
import { log } from '@/shared/config/logger';

/**
 * Sync Service Configuration
 */
interface SyncConfig {
  maxRetries: number;
  batchSize: number;
}

const DEFAULT_CONFIG: SyncConfig = {
  maxRetries: 3,
  batchSize: 10,
};

/**
 * Sync Service
 *
 * Manages bidirectional sync between local SQLite and remote Supabase
 *
 * ## Current Implementation
 *
 * - Currently handles visits only
 * - Uses simple is_synced flag approach
 * - When adding posts/schedules, follow the same pattern as visits
 * - Refactor to generic pattern after 2-3 entities are implemented (Rule of Three)
 */
export class SyncService {
  private syncQueue: SQLiteSyncQueueRepository;
  private visitLocal: SQLiteVisitRepository;
  private visitRemote: SupabaseVisitRepository;
  // @ts-expect-error - 将来の使用のため保持
  private config: SyncConfig;
  private isSyncing: boolean = false;

  constructor(config?: Partial<SyncConfig>) {
    this.syncQueue = new SQLiteSyncQueueRepository();
    this.visitLocal = new SQLiteVisitRepository();
    this.visitRemote = new SupabaseVisitRepository();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ===============================
  // Public API
  // ===============================

  /**
   * Sync all pending changes
   *
   * @returns Sync result summary
   */
  async syncAll(): Promise<SyncResult> {
    // Prevent concurrent syncs
    if (this.isSyncing) {
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

    this.isSyncing = true;
    log.debug('[Sync] Starting sync...');

    try {
      const result = await this._performSync();
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
      this.isSyncing = false;
    }
  }

  /**
   * Get sync status
   */
  async getStatus() {
    const pendingCountResult = await this.syncQueue.getPendingCount();
    const failedItemsResult = await this.syncQueue.getFailedItems();

    return {
      isSyncing: this.isSyncing,
      pendingCount: pendingCountResult.success ? pendingCountResult.data : 0,
      failedCount: failedItemsResult.success && failedItemsResult.data
        ? failedItemsResult.data.length
        : 0,
    };
  }

  /**
   * Retry failed sync items
   */
  async retryFailed(): Promise<void> {
    await this.syncQueue.retryFailed();
  }

  // ===============================
  // Private Implementation
  // ===============================

  private async _performSync(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      syncedCount: 0,
      failedCount: 0,
      errors: [],
    };

    // Step 1: Sync local visits to remote (upload)
    const uploadResult = await this._syncLocalToRemote();
    result.syncedCount += uploadResult.syncedCount;
    result.failedCount += uploadResult.failedCount;
    result.errors.push(...uploadResult.errors);

    // Step 2: Sync remote changes to local (download)
    // TODO: Implement download sync when needed
    // const downloadResult = await this._syncRemoteToLocal();

    // Step 3: Clean up completed items
    await this.syncQueue.removeCompleted();

    result.success = result.failedCount === 0;
    return result;
  }

  private async _syncLocalToRemote(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      syncedCount: 0,
      failedCount: 0,
      errors: [],
    };

    // Step 1: Find unsynced visits in local DB
    const unsyncedResult = await this.visitLocal.findUnsyncedRecords();
    if (!unsyncedResult.success) {
      log.error('[Sync] Failed to find unsynced records:', unsyncedResult.error);
      return result;
    }
    if (!unsyncedResult.data) {
      log.debug('[Sync] No data returned');
      return result;
    }

    const unsyncedVisits = unsyncedResult.data;
    if (unsyncedVisits.length === 0) {
      log.debug('[Sync] No pending sync items');
      return result;
    }

    log.debug(`[Sync] Syncing ${unsyncedVisits.length} visits...`);

    // Step 2: Sync each visit to Supabase
    for (const visit of unsyncedVisits) {
      try {
        // Create on Supabase
        const createResult = await this.visitRemote.create({
          user_id: visit.user_id,
          machi_id: visit.machi_id,
          visited_at: visit.visited_at,
        });

        if (createResult.success) {
          // Mark as synced in local DB
          await this.visitLocal.markAsSynced(visit.id);
          result.syncedCount++;
          log.debug(`[Sync] Synced visit: ${visit.id}`);
        } else {
          throw createResult.error;
        }
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

        // Mark as sync error
        await this.visitLocal.markAsSyncError(visit.id, errorMessage);
      }
    }

    return result;
  }

}

// ===============================
// Singleton Instance
// ===============================

let syncServiceInstance: SyncService | null = null;

export function getSyncService(): SyncService {
  if (!syncServiceInstance) {
    syncServiceInstance = new SyncService();
  }
  return syncServiceInstance;
}
