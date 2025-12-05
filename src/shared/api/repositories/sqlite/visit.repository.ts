/**
 * Visit Repository - SQLite Implementation
 *
 * Infrastructure layer: SQLite-specific implementation
 */

import * as Crypto from 'expo-crypto';
import { getDatabase } from '@/shared/api/sqlite/client';
import type {
  IVisitRepository,
  VisitQueryOptions,
} from '@/entities/visit/model/repository';
import type { VisitRow } from '@/shared/types/database.types';
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

export class SQLiteVisitRepository implements IVisitRepository {
  // ===============================
  // Basic CRUD Operations
  // ===============================

  async findById(id: string): Promise<RepositoryResult<VisitRow | null>> {
    try {
      const db = getDatabase();
      const result = db.getFirstSync<VisitRow>(
        'SELECT * FROM visits WHERE id = ?;',
        [id]
      );
      return success(result || null);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error('Failed to find visit by ID')
      );
    }
  }

  async findAll(
    options?: VisitQueryOptions
  ): Promise<RepositoryResult<VisitRow[]>> {
    try {
      const db = getDatabase();
      let query = 'SELECT * FROM visits WHERE 1=1';
      const params: any[] = [];

      // Apply filters
      if (options?.userId) {
        query += ' AND user_id = ?';
        params.push(options.userId);
      }
      if (options?.machiId) {
        query += ' AND machi_id = ?';
        params.push(options.machiId);
      }
      if (options?.startDate) {
        query += ' AND visited_at >= ?';
        params.push(options.startDate);
      }
      if (options?.endDate) {
        query += ' AND visited_at <= ?';
        params.push(options.endDate);
      }

      // Add ordering
      query += ' ORDER BY visited_at DESC';

      // Add pagination
      if (options?.limit) {
        query += ' LIMIT ?';
        params.push(options.limit);
      }
      if (options?.offset) {
        query += ' OFFSET ?';
        params.push(options.offset);
      }

      const results = db.getAllSync<VisitRow>(query, params);
      return success(results);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error('Failed to find visits')
      );
    }
  }

  async create(
    data: import('@/entities/visit/model/repository').CreateVisitData
  ): Promise<RepositoryResult<VisitRow>> {
    try {
      const db = getDatabase();
      const now = new Date().toISOString();
      const id = Crypto.randomUUID();

      const visit: VisitRow = {
        id,
        user_id: data.user_id,
        machi_id: data.machi_id,
        visited_at: data.visited_at ?? now, // Default to current time
        created_at: now,
        updated_at: now,
        synced_at: null, // Not synced yet
        is_synced: 0, // Not synced yet
      };

      db.runSync(
        `INSERT INTO visits (
          id, user_id, machi_id, visited_at,
          created_at, updated_at, synced_at, is_synced
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          visit.id,
          visit.user_id,
          visit.machi_id,
          visit.visited_at,
          visit.created_at,
          visit.updated_at,
          visit.synced_at,
          visit.is_synced,
        ]
      );

      return success(visit);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error('Failed to create visit')
      );
    }
  }

  async update(
    id: string,
    data: Partial<VisitRow>
  ): Promise<RepositoryResult<VisitRow>> {
    try {
      const db = getDatabase();
      const fields: string[] = [];
      const values: any[] = [];

      // Build update fields
      if (data.visited_at !== undefined) {
        fields.push('visited_at = ?');
        values.push(data.visited_at);
      }

      // Always update timestamp and reset sync status
      if (!data.updated_at) {
        fields.push('updated_at = ?');
        values.push(new Date().toISOString());
      }
      if (data.is_synced === undefined) {
        fields.push('is_synced = ?');
        values.push(0);
        fields.push('synced_at = ?');
        values.push(null);
      }

      if (fields.length === 0) {
        const existing = await this.findById(id);
        if (existing.success && existing.data) {
          return existing as RepositoryResult<VisitRow>;
        }
        return failure(new Error('Visit not found'));
      }

      values.push(id);

      db.runSync(
        `UPDATE visits SET ${fields.join(', ')} WHERE id = ?;`,
        values
      );

      // Fetch updated record
      const updated = await this.findById(id);
      if (!updated.success) {
        return failure(new Error('Failed to fetch updated visit'));
      }
      if (!updated.data) {
        return failure(new Error('Visit not found after update'));
      }

      return success(updated.data);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error('Failed to update visit')
      );
    }
  }

  async delete(id: string): Promise<RepositoryVoidResult> {
    try {
      const db = getDatabase();
      db.runSync('DELETE FROM visits WHERE id = ?;', [id]);
      return voidSuccess();
    } catch (error) {
      return voidFailure(
        error instanceof Error ? error : new Error('Failed to delete visit')
      );
    }
  }

  // ===============================
  // Sync Operations
  // ===============================

  async findUnsyncedRecords(): Promise<RepositoryResult<VisitRow[]>> {
    try {
      const db = getDatabase();
      const results = db.getAllSync<VisitRow>(
        'SELECT * FROM visits WHERE is_synced = 0 ORDER BY created_at ASC;'
      );
      return success(results);
    } catch (error) {
      return failure(
        error instanceof Error
          ? error
          : new Error('Failed to find unsynced visits')
      );
    }
  }

  async markAsSynced(id: string): Promise<RepositoryVoidResult> {
    try {
      const db = getDatabase();
      const now = new Date().toISOString();
      db.runSync(
        'UPDATE visits SET is_synced = 1, synced_at = ? WHERE id = ?;',
        [now, id]
      );
      return voidSuccess();
    } catch (error) {
      return voidFailure(
        error instanceof Error
          ? error
          : new Error('Failed to mark visit as synced')
      );
    }
  }

  async markAsSyncError(
    id: string,
    error: string
  ): Promise<RepositoryVoidResult> {
    try {
      // For now, just log the error. In future, we might add error column
      console.error(`Visit sync error for ${id}:`, error);
      return voidSuccess();
    } catch (err) {
      return voidFailure(
        err instanceof Error
          ? err
          : new Error('Failed to mark visit sync error')
      );
    }
  }

  // ===============================
  // Visit-Specific Operations
  // ===============================

  async findByUserId(
    userId: string,
    options?: VisitQueryOptions
  ): Promise<RepositoryResult<VisitRow[]>> {
    return this.findAll({ ...options, userId });
  }

  async findByMachiId(
    machiId: string,
    options?: VisitQueryOptions
  ): Promise<RepositoryResult<VisitRow[]>> {
    return this.findAll({ ...options, machiId });
  }

  async findByUserAndMachi(
    userId: string,
    machiId: string
  ): Promise<RepositoryResult<VisitRow | null>> {
    try {
      const db = getDatabase();
      const result = db.getFirstSync<VisitRow>(
        'SELECT * FROM visits WHERE user_id = ? AND machi_id = ?;',
        [userId, machiId]
      );
      return success(result || null);
    } catch (error) {
      return failure(
        error instanceof Error
          ? error
          : new Error('Failed to find visit by user and machi')
      );
    }
  }

  async getTotalVisitedMachiCount(
    userId: string
  ): Promise<RepositoryResult<number>> {
    try {
      const db = getDatabase();
      const result = db.getFirstSync<{ count: number }>(
        'SELECT COUNT(DISTINCT machi_id) as count FROM visits WHERE user_id = ?;',
        [userId]
      );
      return success(result?.count || 0);
    } catch (error) {
      return failure(
        error instanceof Error
          ? error
          : new Error('Failed to get total visited machi count')
      );
    }
  }

  async getRecentVisits(
    userId: string,
    limit: number
  ): Promise<RepositoryResult<VisitRow[]>> {
    return this.findByUserId(userId, { limit });
  }

  async deleteByUserId(userId: string): Promise<RepositoryVoidResult> {
    try {
      const db = getDatabase();
      db.runSync('DELETE FROM visits WHERE user_id = ?;', [userId]);
      return voidSuccess();
    } catch (error) {
      return voidFailure(
        error instanceof Error
          ? error
          : new Error('Failed to delete visits by user ID')
      );
    }
  }
}
