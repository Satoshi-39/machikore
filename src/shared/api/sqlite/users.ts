/**
 * Users テーブル操作
 */

import { getDatabase } from './client';
import type { UserRow } from '@/shared/types/database.types';

// ===============================
// 作成
// ===============================

/**
 * ユーザーを挿入
 */
export function insertUser(user: UserRow): void {
  const db = getDatabase();
  db.runSync(
    `INSERT INTO users (
      id, email, username, display_name, avatar_url, bio,
      is_subscribed, subscription_started_at, subscription_expires_at,
      created_at, updated_at, synced_at, is_synced
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      user.id,
      user.email,
      user.username,
      user.display_name,
      user.avatar_url,
      user.bio,
      user.is_subscribed,
      user.subscription_started_at,
      user.subscription_expires_at,
      user.created_at,
      user.updated_at,
      user.synced_at,
      user.is_synced,
    ]
  );
}

// ===============================
// 取得
// ===============================

/**
 * IDでユーザーを取得
 */
export function getUserById(userId: string): UserRow | null {
  const db = getDatabase();
  return db.getFirstSync<UserRow>(
    'SELECT * FROM users WHERE id = ?;',
    [userId]
  );
}

/**
 * メールアドレスでユーザーを取得
 */
export function getUserByEmail(email: string): UserRow | null {
  const db = getDatabase();
  return db.getFirstSync<UserRow>(
    'SELECT * FROM users WHERE email = ?;',
    [email]
  );
}

/**
 * ユーザー名でユーザーを取得
 */
export function getUserByUsername(username: string): UserRow | null {
  const db = getDatabase();
  return db.getFirstSync<UserRow>(
    'SELECT * FROM users WHERE username = ?;',
    [username]
  );
}

/**
 * 全ユーザーを取得
 */
export function getAllUsers(): UserRow[] {
  const db = getDatabase();
  return db.getAllSync<UserRow>('SELECT * FROM users ORDER BY created_at DESC;');
}

// ===============================
// 更新
// ===============================

/**
 * ユーザー情報を更新
 */
export function updateUser(
  userId: string,
  updates: Partial<Omit<UserRow, 'id' | 'created_at'>>
): void {
  const db = getDatabase();
  const fields: string[] = [];
  const values: any[] = [];

  // 更新フィールドを動的に構築
  if (updates.email !== undefined) {
    fields.push('email = ?');
    values.push(updates.email);
  }
  if (updates.username !== undefined) {
    fields.push('username = ?');
    values.push(updates.username);
  }
  if (updates.display_name !== undefined) {
    fields.push('display_name = ?');
    values.push(updates.display_name);
  }
  if (updates.avatar_url !== undefined) {
    fields.push('avatar_url = ?');
    values.push(updates.avatar_url);
  }
  if (updates.bio !== undefined) {
    fields.push('bio = ?');
    values.push(updates.bio);
  }
  if (updates.is_subscribed !== undefined) {
    fields.push('is_subscribed = ?');
    values.push(updates.is_subscribed);
  }
  if (updates.subscription_started_at !== undefined) {
    fields.push('subscription_started_at = ?');
    values.push(updates.subscription_started_at);
  }
  if (updates.subscription_expires_at !== undefined) {
    fields.push('subscription_expires_at = ?');
    values.push(updates.subscription_expires_at);
  }
  if (updates.updated_at !== undefined) {
    fields.push('updated_at = ?');
    values.push(updates.updated_at);
  }
  if (updates.synced_at !== undefined) {
    fields.push('synced_at = ?');
    values.push(updates.synced_at);
  }
  if (updates.is_synced !== undefined) {
    fields.push('is_synced = ?');
    values.push(updates.is_synced);
  }

  if (fields.length === 0) return;

  values.push(userId);

  db.runSync(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?;`,
    values
  );
}

// ===============================
// 削除
// ===============================

/**
 * ユーザーを削除
 */
export function deleteUser(userId: string): void {
  const db = getDatabase();
  db.runSync('DELETE FROM users WHERE id = ?;', [userId]);
}

/**
 * 全ユーザーを削除
 */
export function deleteAllUsers(): void {
  const db = getDatabase();
  db.runSync('DELETE FROM users;');
}
