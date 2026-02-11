/**
 * マップビューページ
 *
 * FSDの原則：PagesレイヤーはWidgetの組み合わせ + データ取得
 * Mapbox GL JSの全画面地図 + スポット詳細パネル
 */

import { getMapSpots } from "@/shared/api/supabase/maps/get-map-spots";
import { MapPageContent } from "@/widgets/map-view";

type MapViewPageProps = {
  username: string;
  mapId: string;
};

export async function MapViewPage({ username, mapId }: MapViewPageProps) {
  const spots = await getMapSpots(mapId);
  const articlePath = `/${username}/maps/${mapId}`;

  return <MapPageContent articlePath={articlePath} spots={spots} />;
}
