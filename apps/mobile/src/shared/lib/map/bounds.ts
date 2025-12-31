/**
 * マップの境界計算ユーティリティ
 */

/**
 * カメラ位置とズームレベルから地理的な境界を計算
 *
 * @param center - 中心座標
 * @param zoomLevel - ズームレベル
 * @returns 境界座標（minLat, maxLat, minLng, maxLng）
 */
export function calculateBoundsFromCamera(
  center: { lat: number; lng: number },
  zoomLevel: number
): {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
} {
  // ズームレベルから大まかな範囲を計算
  // Mapboxのズームレベル計算式: デルタ = 世界の幅 / 2^zoom
  const latDelta = 180 / Math.pow(2, zoomLevel);
  const lngDelta = 360 / Math.pow(2, zoomLevel);

  return {
    minLat: center.lat - latDelta,
    maxLat: center.lat + latDelta,
    minLng: center.lng - lngDelta,
    maxLng: center.lng + lngDelta,
  };
}
