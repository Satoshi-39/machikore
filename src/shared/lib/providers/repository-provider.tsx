/**
 * Repository Provider - Dependency Injection
 *
 * Provides repository instances to the entire app via Context API
 * Automatically switches between SQLite (offline) and Supabase (online)
 *
 * ## Architecture
 *
 * This provider manages ALL repository instances (SQLite + Supabase) for:
 * - Visits (✅ implemented)
 * - Posts (⏳ pending)
 * - Users (⏳ pending)
 * - Schedules (⏳ pending)
 *
 * ## Usage
 *
 * ```tsx
 * // Get local repository (Offline-First)
 * const visitRepo = useVisitRepository();
 *
 * // Get remote repository (Admin/Sync operations)
 * const remoteVisitRepo = useRemoteRepository('visit');
 * ```
 *
 * ## Adding New Entities
 *
 * 1. Create repository interface: `src/entities/{entity}/model/repository.ts`
 * 2. Implement SQLite: `src/shared/api/repositories/sqlite/{entity}.repository.ts`
 * 3. Implement Supabase: `src/shared/api/repositories/supabase/{entity}.repository.ts`
 * 4. Add to RepositoryContainer interface below
 * 5. Add to repository instances initialization
 * 6. Create custom hook: `use{Entity}Repository()`
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { SQLiteVisitRepository } from '@/shared/api/repositories/sqlite/visit.repository';
import { SupabaseVisitRepository } from '@/shared/api/repositories/supabase/visit.repository';
import type { IVisitRepository } from '@/entities/visit/model/repository';

// ===============================
// Repository Container
// ===============================

/**
 * Container for all repository instances
 *
 * Each entity has two repository instances:
 * - local: SQLite implementation (Offline-First, always available)
 * - remote: Supabase implementation (Cloud master, requires network)
 */
interface RepositoryContainer {
  visit: {
    local: IVisitRepository; // SQLite (always available)
    remote: IVisitRepository; // Supabase (requires network)
  };
  // TODO: Add when implemented
  // post: {
  //   local: IPostRepository;
  //   remote: IPostRepository;
  // };
  // user: {
  //   local: IUserRepository;
  //   remote: IUserRepository;
  // };
  // schedule: {
  //   local: IScheduleRepository;
  //   remote: IScheduleRepository;
  // };
}

// ===============================
// Context Setup
// ===============================

const RepositoryContext = createContext<RepositoryContainer | null>(null);

// ===============================
// Provider Component
// ===============================

interface RepositoryProviderProps {
  children: ReactNode;
}

export function RepositoryProvider({ children }: RepositoryProviderProps) {
  // Create repository instances (singleton pattern)
  const repositories: RepositoryContainer = React.useMemo(
    () => ({
      visit: {
        local: new SQLiteVisitRepository(),
        remote: new SupabaseVisitRepository(),
      },
    }),
    []
  );

  return (
    <RepositoryContext.Provider value={repositories}>
      {children}
    </RepositoryContext.Provider>
  );
}

// ===============================
// Hook: useRepositories
// ===============================

/**
 * Access all repositories
 *
 * @example
 * const { visit } = useRepositories();
 * const result = await visit.local.findAll();
 */
export function useRepositories(): RepositoryContainer {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error('useRepositories must be used within RepositoryProvider');
  }
  return context;
}

// ===============================
// Hook: useVisitRepository
// ===============================

/**
 * Access Visit repository with automatic online/offline switching
 *
 * Strategy:
 * - Always use local (SQLite) as the primary data source (Offline-First)
 * - Sync changes to remote (Supabase) when online
 * - This hook returns the local repository for reads/writes
 * - Background sync service handles synchronization
 *
 * @example
 * const visitRepo = useVisitRepository();
 * const result = await visitRepo.findAll();
 */
export function useVisitRepository(): IVisitRepository {
  const { visit } = useRepositories();

  // Always use local repository (Offline-First strategy)
  // Background sync service will handle syncing to remote
  return visit.local;
}

// ===============================
// Hook: useRemoteRepository (for admin/sync operations)
// ===============================

/**
 * Access remote (Supabase) repository directly
 *
 * Use cases:
 * - Admin operations that require server data
 * - Initial data sync/download
 * - Data verification
 *
 * Note: This requires network connection
 *
 * @example
 * const remoteRepo = useRemoteRepository('visit');
 * const result = await remoteRepo.findAll();
 */
export function useRemoteRepository(
  entity: keyof RepositoryContainer
): IVisitRepository {
  const repositories = useRepositories();
  return repositories[entity].remote;
}
