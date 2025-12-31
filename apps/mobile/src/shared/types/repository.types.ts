/**
 * Repository Pattern common types
 *
 * Data access layer abstraction for SQLite and Supabase
 */

// ===============================
// Sync Status
// ===============================

// Note: SyncStatus は sync.types.ts に定義されています

export interface SyncMetadata {
  is_synced: boolean;
  synced_at: string | null;
  last_error: string | null;
}

// ===============================
// Repository Result Types
// ===============================

export type RepositoryResult<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

export type RepositoryVoidResult =
  | { success: true }
  | { success: false; error: Error };

// ===============================
// Query Options
// ===============================

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export interface FilterOptions {
  userId?: string;
  machiId?: string;
  startDate?: string;
  endDate?: string;
}

// ===============================
// Base Repository Interface
// ===============================

/**
 * Base repository interface for CRUD operations
 *
 * @template T - The entity type (e.g., VisitRow)
 * @template TCreate - The data type for creation (defaults to Omit<T, 'id' | 'created_at' | 'updated_at'>)
 * @template TId - The ID type (defaults to string)
 */
export interface BaseRepository<
  T,
  TCreate = Omit<T, 'id' | 'created_at' | 'updated_at'>,
  TId = string
> {
  /**
   * Find by ID
   */
  findById(id: TId): Promise<RepositoryResult<T | null>>;

  /**
   * Find all with optional filters and pagination
   */
  findAll(
    options?: QueryOptions & FilterOptions
  ): Promise<RepositoryResult<T[]>>;

  /**
   * Create new record
   */
  create(data: TCreate): Promise<RepositoryResult<T>>;

  /**
   * Update existing record
   */
  update(id: TId, data: Partial<T>): Promise<RepositoryResult<T>>;

  /**
   * Delete record
   */
  delete(id: TId): Promise<RepositoryVoidResult>;
}

// ===============================
// Sync Repository Interface
// ===============================

/**
 * Repository interface with sync capabilities
 *
 * @template T - The entity type (e.g., VisitRow)
 * @template TCreate - The data type for creation (defaults to Omit<T, 'id' | 'created_at' | 'updated_at'>)
 * @template TId - The ID type (defaults to string)
 */
export interface SyncableRepository<
  T,
  TCreate = Omit<T, 'id' | 'created_at' | 'updated_at'>,
  TId = string
> extends BaseRepository<T, TCreate, TId> {
  /**
   * Get all records that need to be synced
   */
  findUnsyncedRecords(): Promise<RepositoryResult<T[]>>;

  /**
   * Mark record as synced
   */
  markAsSynced(id: TId): Promise<RepositoryVoidResult>;

  /**
   * Mark record as sync error
   */
  markAsSyncError(id: TId, error: string): Promise<RepositoryVoidResult>;
}

// ===============================
// Helper Functions
// ===============================

/**
 * Create success result
 */
export function success<T>(data: T): RepositoryResult<T> {
  return { success: true, data };
}

/**
 * Create error result
 */
export function failure<T>(error: Error | string): RepositoryResult<T> {
  return {
    success: false,
    error: error instanceof Error ? error : new Error(error),
  };
}

/**
 * Create void success result
 */
export function voidSuccess(): RepositoryVoidResult {
  return { success: true };
}

/**
 * Create void error result
 */
export function voidFailure(error: Error | string): RepositoryVoidResult {
  return {
    success: false,
    error: error instanceof Error ? error : new Error(error),
  };
}
