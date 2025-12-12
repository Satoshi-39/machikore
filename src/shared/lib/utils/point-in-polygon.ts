/**
 * Point-in-Polygon判定ユーティリティ
 *
 * Ray Casting アルゴリズムを使用して、
 * 点がポリゴン内にあるかどうかを判定
 */

type Coordinate = [number, number]; // [lng, lat]
type Ring = Coordinate[];
type PolygonCoordinates = Ring[];
type MultiPolygonCoordinates = Ring[][];

interface Geometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: PolygonCoordinates | MultiPolygonCoordinates;
}

/**
 * Ray Casting アルゴリズムで点がリング（閉じた線）の内側にあるか判定
 */
function pointInRing(point: Coordinate, ring: Ring): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i]![0];
    const yi = ring[i]![1];
    const xj = ring[j]![0];
    const yj = ring[j]![1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * 点がPolygon内にあるか判定
 * ポリゴンは外側リング + 穴（内側リング）で構成される
 */
function pointInPolygon(point: Coordinate, coordinates: PolygonCoordinates): boolean {
  // 最初のリングは外側（境界）
  const outerRing = coordinates[0];
  if (!outerRing || !pointInRing(point, outerRing)) {
    return false;
  }

  // 残りのリングは穴（内側）- 穴の中にあれば外
  for (let i = 1; i < coordinates.length; i++) {
    const hole = coordinates[i];
    if (hole && pointInRing(point, hole)) {
      return false;
    }
  }

  return true;
}

/**
 * 点がMultiPolygon内にあるか判定
 * 複数のポリゴンのいずれかに含まれていればtrue
 */
function pointInMultiPolygon(
  point: Coordinate,
  coordinates: MultiPolygonCoordinates
): boolean {
  for (const polygonCoords of coordinates) {
    if (pointInPolygon(point, polygonCoords)) {
      return true;
    }
  }
  return false;
}

/**
 * 点がジオメトリ内にあるか判定
 */
export function pointInGeometry(
  longitude: number,
  latitude: number,
  geometry: Geometry
): boolean {
  const point: Coordinate = [longitude, latitude];

  if (geometry.type === 'Polygon') {
    return pointInPolygon(point, geometry.coordinates as PolygonCoordinates);
  } else if (geometry.type === 'MultiPolygon') {
    return pointInMultiPolygon(point, geometry.coordinates as MultiPolygonCoordinates);
  }

  return false;
}
