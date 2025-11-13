/**
 * Sync Queue Repository - SQLite Implementation
 *
 * Manages the sync operation queue for offline-first architecture
 */

import * as Crypto from 'expo-crypto';
import { getDatabase } from '@/shared/api/sqlite/client';
import type {
  SyncQueueRow,
  CreateSyncQueueData,
  SyncStatus,
  SyncEntity,
} from '@/shared/types/sync.types';
import type {
  RepositoryResult,
  RepositoryVoidResult,
} from '@/shared/types/repository.types';
import {
  success,
  failure,
  voidSuccess,
  voidFailure,
} from '@/shared/types/repository.types';

export class SQLiteSyncQueueRepository {
  // ===============================
  // Queue Operations
  // ===============================

  async enqueue(
    data: CreateSyncQueueData
  ): Promise<RepositoryResult<SyncQueueRow>> {
    try {
      const db = getDatabase();
      const now = new Date().toISOString();
      const id = Crypto.randomUUID();

      const queueItem: SyncQueueRow = {
        id,
        entity_type: data.entity_type,
        entity_id: data.entity_id,
        operation: data.operation,
        data: JSON.stringify(data.data),
        status: 'pending',
        retry_count: 0,
        last_error: null,
        created_at: now,
        updated_at: now,
      };

      db.runSync(
        `INSERT INTO sync_queue (
          id, entity_type, entity_id, operation, data,
          status, retry_count, last_error, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          queueItem.id,
          queueItem.entity_type,
          queueItem.entity_id,
          queueItem.operation,
          queueItem.data,
          queueItem.status,
          queueItem.retry_count,
          queueItem.last_error,
          queueItem.created_at,
          queueItem.updated_at,
        ]
      );

      return success(queueItem);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error('Failed to enqueue sync item')
      );
    }
  }

  async dequeue(limit: number = 10): Promise<RepositoryResult<SyncQueueRow[]>> {
    try {
      const db = getDatabase();
      const items = db.getAllSync<SyncQueueRow>(
        `SELECT * FROM sync_queue
         WHERE status = 'pending'
         ORDER BY created_at ASC
         LIMIT ?;`,
        [limit]
      );

      return success(items);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error('Failed to dequeue sync items')
      );
    }
  }

  async updateStatus(
    id: string,
    status: SyncStatus,
    error?: string
  ): Promise<RepositoryVoidResult> {
    try {
      const db = getDatabase();
      const now = new Date().toISOString();

      if (error) {
        db.runSync(
          `UPDATE sync_queue
           SET status = ?,
               last_error = ?,
               retry_count = retry_count + 1,
               updated_at = ?
           WHERE id = ?;`,
          [status, error, now, id]
        );
      } else {
        db.runSync(
          `UPDATE sync_queue
           SET status = ?,
               updated_at = ?
           WHERE id = ?;`,
          [status, now, id]
        );
      }

      return voidSuccess();
    } catch (error) {
      return voidFailure(
        error instanceof Error
          ? error
          : new Error('Failed to update sync status')
      );
    }
  }

  async remove(id: string): Promise<RepositoryVoidResult> {
    try {
      const db = getDatabase();
      db.runSync('DELETE FROM sync_queue WHERE id = ?;', [id]);
      return voidSuccess();
    } catch (error) {
      return voidFailure(
        error instanceof Error
          ? error
          : new Error('Failed to remove sync item')
      );
    }
  }

  async removeCompleted(): Promise<RepositoryVoidResult> {
    try {
      const db = getDatabase();
      db.runSync(`DELETE FROM sync_queue WHERE status = 'completed';`);
      return voidSuccess();
    } catch (error) {
      return voidFailure(
        error instanceof Error
          ? error
          : new Error('Failed to remove completed items')
      );
    }
  }

  async getPendingCount(): Promise<RepositoryResult<number>> {
    try {
      const db = getDatabase();
      const result = db.getFirstSync<{ count: number }>(
        `SELECT COUNT(*) as count FROM sync_queue WHERE status = 'pending';`
      );
      return success(result?.count || 0);
    } catch (error) {
      return failure(
        error instanceof Error
          ? error
          : new Error('Failed to get pending count')
      );
    }
  }

  async getFailedItems(): Promise<RepositoryResult<SyncQueueRow[]>> {
    try {
      const db = getDatabase();
      const items = db.getAllSync<SyncQueueRow>(
        `SELECT * FROM sync_queue
         WHERE status = 'failed'
         ORDER BY updated_at DESC;`
      );
      return success(items);
    } catch (error) {
      return failure(
        error instanceof Error
          ? error
          : new Error('Failed to get failed items')
      );
    }
  }

  async retryFailed(): Promise<RepositoryVoidResult> {
    try {
      const db = getDatabase();
      const now = new Date().toISOString();
      db.runSync(
        `UPDATE sync_queue
         SET status = 'pending',
             last_error = NULL,
             updated_at = ?
         WHERE status = 'failed' AND retry_count < 3;`,
        [now]
      );
      return voidSuccess();
    } catch (error) {
      return voidFailure(
        error instanceof Error ? error : new Error('Failed to retry failed items')
      );
    }
  }

  async clearAll(): Promise<RepositoryVoidResult> {
    try {
      const db = getDatabase();
      db.runSync('DELETE FROM sync_queue;');
      return voidSuccess();
    } catch (error) {
      return voidFailure(
        error instanceof Error ? error : new Error('Failed to clear sync queue')
      );
    }
  }

  // ===============================
  // Entity-Specific Operations
  // ===============================

  async getByEntity(
    entityType: SyncEntity,
    entityId: string
  ): Promise<RepositoryResult<SyncQueueRow[]>> {
    try {
      const db = getDatabase();
      const items = db.getAllSync<SyncQueueRow>(
        `SELECT * FROM sync_queue
         WHERE entity_type = ? AND entity_id = ?
         ORDER BY created_at ASC;`,
        [entityType, entityId]
      );
      return success(items);
    } catch (error) {
      return failure(
        error instanceof Error
          ? error
          : new Error('Failed to get sync items by entity')
      );
    }
  }
}
