/**
 * マップ記事ページ
 *
 * FSDの原則：PagesレイヤーはWidgetの組み合わせ + データ取得
 * マップの説明と各スポットをブログ形式で紹介
 */

import { notFound } from "next/navigation";
import { getMapArticle } from "@/shared/api/supabase/maps/get-map-article";
import { ENV } from "@/shared/config/env";
import { MapArticleContent } from "@/widgets/map-article-content";
import { MapToggleButton } from "@/widgets/map-article-content/ui/MapToggleButton";

type MapArticlePageProps = {
  username: string;
  mapId: string;
};

export async function MapArticlePage({
  username,
  mapId,
}: MapArticlePageProps) {
  const data = await getMapArticle(mapId);

  if (!data || data.map.user?.username !== username) notFound();

  const mapPath = `/${username}/maps/${mapId}`;

  return (
    <>
      <MapArticleContent data={data} supabaseUrl={ENV.SUPABASE_URL} />
      <MapToggleButton mapPath={`${mapPath}/map`} />
    </>
  );
}
