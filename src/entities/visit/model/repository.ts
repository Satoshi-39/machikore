/**
 * Visit Repository Interface
 *
 * Domain layer abstraction for visit data access
 */

import type {
  SyncableRepository,
  RepositoryResult,
  RepositoryVoidResult,
} from '@/shared/types/repository.types';
import type { VisitRow } from '@/shared/types/database.types';

/**
 * Visit-specific query options
 */
export interface VisitQueryOptions {
  userId?: string;
  machiId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

/**
 * Visit creation data
 */
export interface CreateVisitData {
  user_id: string;
  machi_id: string;
  visited_at?: string;
}

/**
 * Visit update data
 */
export interface UpdateVisitData {
  visited_at?: string;
  updated_at?: string;
}

/**
 * Visit Repository Interface
 *
 * Provides data access methods for Visit entity
 */
export interface IVisitRepository extends SyncableRepository<VisitRow, CreateVisitData> {
  /**
   * Find visits by user ID
   */
  findByUserId(
    userId: string,
    options?: VisitQueryOptions
  ): Promise<RepositoryResult<VisitRow[]>>;

  /**
   * Find visits by machi ID
   */
  findByMachiId(
    machiId: string,
    options?: VisitQueryOptions
  ): Promise<RepositoryResult<VisitRow[]>>;

  /**
   * Find visit by user and machi
   */
  findByUserAndMachi(
    userId: string,
    machiId: string
  ): Promise<RepositoryResult<VisitRow | null>>;

  /**
   * Get total visited machi count for user
   */
  getTotalVisitedMachiCount(userId: string): Promise<RepositoryResult<number>>;

  /**
   * Get recent visits for user
   */
  getRecentVisits(
    userId: string,
    limit: number
  ): Promise<RepositoryResult<VisitRow[]>>;

  /**
   * Delete visits by user ID
   */
  deleteByUserId(userId: string): Promise<RepositoryVoidResult>;
}
