/**
 * Machi ビジネスロジック
 */

import type { MachiRow } from '@/shared/types/database.types';
import type { MachiVisitStatus, MachiDistance } from './types';

// ===============================
// 訪問状態判定
// ===============================

/**
 * 訪問回数から訪問状態を取得
 */
export function getVisitStatus(visitCount: number): MachiVisitStatus {
  if (visitCount === 0) return 'unvisited';
  if (visitCount === 1) return 'first';
  if (visitCount === 2) return 'second';
  return 'multiple';
}

/**
 * 訪問状態に対応するアイコンを取得
 */
export function getVisitStatusIcon(status: MachiVisitStatus): string {
  const icons = {
    unvisited: '📍',
    first: '✅',
    second: '⭐️',
    multiple: '🏆',
  };
  return icons[status];
}

/**
 * 訪問状態の表示名を取得
 */
export function getVisitStatusLabel(status: MachiVisitStatus): string {
  const labels = {
    unvisited: '未訪問',
    first: '初訪問',
    second: '2回目',
    multiple: '複数回',
  };
  return labels[status];
}

// ===============================
// 距離計算
// ===============================

/**
 * 2点間の距離を計算（Haversine公式）
 * @returns 距離（km）
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 地球の半径（km）
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // 小数点第2位まで
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 現在地から近い順に街をソート
 */
export function sortMachiByDistance(
  machiList: MachiRow[],
  currentLat: number,
  currentLon: number
): MachiDistance[] {
  const machiWithDistance: MachiDistance[] = machiList.map((machi) => ({
    machi,
    distance: calculateDistance(
      currentLat,
      currentLon,
      machi.latitude,
      machi.longitude
    ),
  }));

  return machiWithDistance.sort((a, b) => a.distance - b.distance);
}

/** @deprecated Use sortMachiByDistance instead */
export const sortStationsByDistance = sortMachiByDistance;

// ===============================
// フィルタリング
// ===============================

/**
 * 街名で検索
 */
export function filterMachiByName(
  machiList: MachiRow[],
  searchTerm: string
): MachiRow[] {
  if (!searchTerm.trim()) return machiList;

  const normalized = searchTerm.toLowerCase().trim();
  return machiList.filter((machi) =>
    machi.name.toLowerCase().includes(normalized)
  );
}

/**
 * 都道府県で絞り込み
 */
export function filterMachiByPrefecture(
  machiList: MachiRow[],
  prefectureId: string
): MachiRow[] {
  if (!prefectureId) return machiList;
  return machiList.filter((machi) => machi.prefecture_id === prefectureId);
}

// ===============================
// ソート
// ===============================

/**
 * 街名（五十音順）でソート
 */
export function sortMachiByName(machiList: MachiRow[]): MachiRow[] {
  return [...machiList].sort((a, b) => a.name.localeCompare(b.name, 'ja'));
}

// ===============================
// ユーティリティ
// ===============================

/**
 * 街の表示名を取得
 */
export function getMachiDisplayName(machi: MachiRow): string {
  return machi.name;
}

/**
 * 街IDのバリデーション
 */
export function isValidMachiId(machiId: string): boolean {
  return /^sta_[a-z0-9_]+$/.test(machiId);
}

// ===============================
// 後方互換性エイリアス（廃止予定）
// ===============================

/** @deprecated Use filterMachiByName instead */
export const filterStationsByName = filterMachiByName;
/** @deprecated Use filterMachiByPrefecture instead */
export const filterStationsByPrefecture = filterMachiByPrefecture;
/** @deprecated Use sortMachiByName instead */
export const sortStationsByName = sortMachiByName;
/** @deprecated Use getMachiDisplayName instead */
export const getStationDisplayName = getMachiDisplayName;
/** @deprecated Use isValidMachiId instead */
export const isValidStationId = isValidMachiId;
