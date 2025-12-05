/**
 * Visit Repository - Supabase Implementation
 *
 * Infrastructure layer: Supabase-specific implementation
 */

import { supabase } from '@/shared/api/supabase/client';
import type {
  IVisitRepository,
  VisitQueryOptions,
  CreateVisitData,
} from '@/entities/visit/model/repository';
import type { VisitRow } from '@/shared/types/database.types';
import { convertSupabaseVisitToSQLite } from '@/shared/types/database.types';
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

export class SupabaseVisitRepository implements IVisitRepository {
  // ===============================
  // Basic CRUD Operations
  // ===============================

  async findById(id: string): Promise<RepositoryResult<VisitRow | null>> {
    try {
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return success(data ? convertSupabaseVisitToSQLite(data) : null);
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
      let query = supabase.from('visits').select('*');

      // Apply filters
      if (options?.userId) {
        query = query.eq('user_id', options.userId);
      }
      if (options?.machiId) {
        query = query.eq('machi_id', options.machiId);
      }
      if (options?.startDate) {
        query = query.gte('visited_at', options.startDate);
      }
      if (options?.endDate) {
        query = query.lte('visited_at', options.endDate);
      }

      // Add ordering
      query = query.order('visited_at', { ascending: false });

      // Add pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return success(
        (data || []).map((visit) => convertSupabaseVisitToSQLite(visit))
      );
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error('Failed to find visits')
      );
    }
  }

  async create(data: CreateVisitData): Promise<RepositoryResult<VisitRow>> {
    try {
      const now = new Date().toISOString();

      const visit = {
        user_id: data.user_id,
        machi_id: data.machi_id,
        visited_at: data.visited_at ?? now,
        // Supabase will auto-generate: id, created_at, updated_at
      };

      console.log('🔍 Creating visit in Supabase:', visit);

      const { data: created, error } = await supabase
        .from('visits')
        .insert(visit)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log('✅ Created in Supabase:', created);
      return success(convertSupabaseVisitToSQLite(created));
    } catch (error) {
      console.error('❌ Exception in create:', error);
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
      const updates: Record<string, any> = {};

      // Build update fields
      if (data.visited_at !== undefined) {
        updates.visited_at = data.visited_at;
      }

      // Supabase auto-updates updated_at via trigger
      updates.updated_at = new Date().toISOString();

      if (Object.keys(updates).length === 0) {
        const existing = await this.findById(id);
        if (existing.success && existing.data) {
          return existing as RepositoryResult<VisitRow>;
        }
        return failure(new Error('Visit not found'));
      }

      const { data: updated, error } = await supabase
        .from('visits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!updated) {
        return failure(new Error('Visit not found'));
      }

      return success(convertSupabaseVisitToSQLite(updated));
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error('Failed to update visit')
      );
    }
  }

  async delete(id: string): Promise<RepositoryVoidResult> {
    try {
      const { error } = await supabase.from('visits').delete().eq('id', id);

      if (error) throw error;
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
    // Supabase is the source of truth, no local sync status
    // This method is mainly for SQLite implementation
    return success([]);
  }

  async markAsSynced(_id: string): Promise<RepositoryVoidResult> {
    // Not applicable for Supabase (always synced)
    return voidSuccess();
  }

  async markAsSyncError(
    _id: string,
    error: string
  ): Promise<RepositoryVoidResult> {
    // Not applicable for Supabase (no local sync queue)
    console.error('Visit sync error:', error);
    return voidSuccess();
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
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .eq('user_id', userId)
        .eq('machi_id', machiId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned (not an error)
        throw error;
      }

      return success(data ? convertSupabaseVisitToSQLite(data) : null);
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
      // Get distinct count of machi_id
      const { data: distinctData, error } = await supabase
        .from('visits')
        .select('machi_id')
        .eq('user_id', userId);

      if (error) throw error;

      const distinctCount = new Set(distinctData?.map((v) => v.machi_id)).size;
      return success(distinctCount);
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
      const { error } = await supabase
        .from('visits')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
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
