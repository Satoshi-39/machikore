/**
 * 検索結果コンポーネントの共通型定義
 */

export interface SearchResultHandlers {
  onSpotPress: (spotId: string) => void;
  onMapPress: (mapId: string) => void;
  onUserPress: (userId: string) => void;
  onSpotCommentPress: (spotId: string) => void;
  onMapCommentPress: (mapId: string) => void;
  onTagPress: (tagName: string) => void;
  onEditSpot: (spotId: string) => void;
  onDeleteSpot: (spotId: string) => void;
  onReportSpot: (spotId: string) => void;
  onEditMap: (mapId: string) => void;
  onDeleteMap: (mapId: string) => void;
  onReportMap: (mapId: string) => void;
}
