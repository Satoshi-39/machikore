/**
 * Sync types
 */

// ===============================
// Sync Queue Types
// ===============================

export type SyncOperation = 'create' | 'update' | 'delete';

export type SyncEntity = 'visits' | 'posts' | 'users' | 'schedules';

export type SyncStatus = 'pending' | 'syncing' | 'completed' | 'failed';

/**
 * Sync queue row (SQLite)
 */
export interface SyncQueueRow {
  id: string;
  entity_type: SyncEntity;
  entity_id: string;
  operation: SyncOperation;
  data: string; // JSON string
  status: SyncStatus;
  retry_count: number;
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Sync queue create data
 */
export interface CreateSyncQueueData {
  entity_type: SyncEntity;
  entity_id: string;
  operation: SyncOperation;
  data: any; // Will be stringified
}

// ===============================
// Sync Result Types
// ===============================

export interface SyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  errors: Array<{
    queueId: string;
    entityType: SyncEntity;
    entityId: string;
    error: string;
  }>;
}
