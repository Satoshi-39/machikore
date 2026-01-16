/**
 * マガジン関連のビジネスロジック
 */

import type { MagazineSection } from './types';
import type { MapWithUser } from '@/shared/types';

/** セクション付きマップ */
export interface MagazineMapWithSection extends MapWithUser {
  section_id: string | null;
}

/** セクションとそのマップのグループ */
export interface MagazineSectionWithMaps {
  section: MagazineSection | null; // nullはセクションなしのマップ
  maps: MapWithUser[];
}

/**
 * マップをセクションごとにグループ化する
 *
 * @param maps セクションID付きのマップ一覧
 * @param sections セクション一覧
 * @returns セクションごとにグループ化されたマップ
 *
 * @example
 * const grouped = groupMapsBySections(maps, sections);
 * // [
 * //   { section: null, maps: [...] },        // セクションなし
 * //   { section: { id: '...', title: '東京エリア' }, maps: [...] },
 * //   { section: { id: '...', title: '神奈川エリア' }, maps: [...] },
 * // ]
 */
export function groupMapsBySections(
  maps: MagazineMapWithSection[],
  sections: MagazineSection[]
): MagazineSectionWithMaps[] {
  const result: MagazineSectionWithMaps[] = [];

  // セクションなしのマップ
  const noSectionMaps = maps.filter((m) => m.section_id === null);
  if (noSectionMaps.length > 0) {
    result.push({ section: null, maps: noSectionMaps });
  }

  // 各セクションのマップ（display_order順にソート済みのsectionsを使用）
  // マップが0件でもセクションは表示する
  for (const section of sections) {
    const sectionMaps = maps.filter((m) => m.section_id === section.id);
    result.push({ section, maps: sectionMaps });
  }

  return result;
}
