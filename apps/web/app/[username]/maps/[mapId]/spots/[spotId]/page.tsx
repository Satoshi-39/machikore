import type { Metadata } from "next";
import type { Json } from "@machikore/database";
import { notFound } from "next/navigation";
import { createClient } from "@/shared/api/supabase/server";
import {
  APP_NAME,
  DEFAULT_OGP_IMAGE,
  DEEP_LINKS,
  WEB_URLS,
  isReservedUsername,
} from "@/shared/config";
import { ShareLandingPage } from "@/shared/ui";

type Props = {
  params: Promise<{ username: string; mapId: string; spotId: string }>;
};

/**
 * master_spots.name は JSONB（{"ja": "...", "en": "..."}）のため、
 * 日本語名を優先して取得する
 */
function resolveSpotName(nameJson: Json): string {
  if (typeof nameJson === "string") return nameJson;
  if (nameJson && typeof nameJson === "object" && !Array.isArray(nameJson)) {
    const obj = nameJson as Record<string, string>;
    return obj.ja || obj.en || "スポット";
  }
  return "スポット";
}

async function getSpot(username: string, mapId: string, spotId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_spots")
    .select(
      `
      id,
      description,
      map_id,
      master_spots!inner(name),
      maps!inner(id, name, is_public, users!inner(username, display_name))
    `
    )
    .eq("id", spotId)
    .eq("map_id", mapId)
    .single();

  if (error || !data) return null;

  const maps = data.maps as unknown as {
    id: string;
    name: string;
    is_public: boolean;
    users: { username: string; display_name: string };
  };

  // 非公開マップ、またはURLのusernameが不一致
  if (!maps.is_public || maps.users.username !== username) return null;

  // スポットの最初の画像を取得
  const { data: images } = await supabase
    .from("images")
    .select("cloud_path")
    .eq("user_spot_id", spotId)
    .order("order_index", { ascending: true })
    .limit(1);

  const masterSpots = data.master_spots as unknown as { name: Json };

  return {
    spotName: resolveSpotName(masterSpots.name),
    description: data.description,
    mapName: maps.name,
    authorName: maps.users.display_name,
    imageUrl: images?.[0]?.cloud_path || null,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, mapId, spotId } = await params;

  if (isReservedUsername(username))
    return { title: "ページが見つかりません" };

  const spot = await getSpot(username, mapId, spotId);

  if (!spot) {
    return { title: "スポットが見つかりません" };
  }

  const description =
    spot.description || `${spot.authorName}の「${spot.mapName}」に掲載`;
  const imageUrl = spot.imageUrl || DEFAULT_OGP_IMAGE;
  const url = WEB_URLS.spot(username, mapId, spotId);

  return {
    title: `${spot.spotName} - ${APP_NAME}`,
    description,
    openGraph: {
      title: spot.spotName,
      description,
      images: [{ url: imageUrl }],
      url,
      type: "website",
      siteName: APP_NAME,
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title: spot.spotName,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function SpotPage({ params }: Props) {
  const { username, mapId, spotId } = await params;

  if (isReservedUsername(username)) notFound();

  const spot = await getSpot(username, mapId, spotId);

  if (!spot) notFound();

  const description =
    spot.description || `${spot.authorName}の「${spot.mapName}」に掲載`;

  return (
    <ShareLandingPage
      title={spot.spotName}
      description={description}
      imageUrl={spot.imageUrl}
      deepLink={DEEP_LINKS.spot(mapId, spotId)}
    />
  );
}
