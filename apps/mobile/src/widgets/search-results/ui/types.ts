/**
 * 検索結果コンポーネントの共通型定義
 */

export interface SearchResultHandlers {
  onSpotPress: (spotId: string) => void;
  onMapPress: (mapId: string) => void;
  /** スポットカード内のマップアイコンタップ時（マップ内スポットへの遷移用） */
  onSpotMapPress: (spotId: string, mapId: string) => void;
  onUserPress: (userId: string) => void;
  onSpotCommentPress: (spotId: string) => void;
  onMapCommentPress: (mapId: string) => void;
  onTagPress: (tagName: string) => void;
  onEditSpot: (spotId: string) => void;
  onDeleteSpot: (spotId: string) => void;
  onReportSpot: (spotId: string) => void;
  onBlockFromSpot?: (userId: string) => void;
  onEditMap: (mapId: string) => void;
  onDeleteMap: (mapId: string) => void;
  onReportMap: (mapId: string) => void;
  onBlockFromMap?: (userId: string) => void;
}
