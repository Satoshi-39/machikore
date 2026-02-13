import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMap } from "@/shared/api/supabase/maps";
import {
  APP_NAME,
  DEEP_LINKS,
  DEFAULT_OGP_IMAGE,
  ENV,
  WEB_URLS,
  isReservedUsername,
} from "@/shared/config";
import { MapArticlePage } from "@/pages/map-article";
import { ShareLandingPage } from "@/shared/ui";

type Props = {
  params: Promise<{ username: string; mapId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, mapId } = await params;

  if (isReservedUsername(username)) return { title: "ページが見つかりません" };

  const map = await getMap(mapId);

  if (!map || map.user?.username !== username) {
    return { title: "マップが見つかりません" };
  }

  const title = `${map.name} - ${APP_NAME}`;
  const description =
    map.description || `${map.user.display_name || map.user.username}のマップ`;
  const imageUrl = map.thumbnail_url || DEFAULT_OGP_IMAGE;
  const url = WEB_URLS.map(username, mapId);

  return {
    title,
    description,
    openGraph: {
      title: map.name,
      description,
      images: [{ url: imageUrl }],
      url,
      type: "website",
      siteName: APP_NAME,
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title: map.name,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function MapPage({ params }: Props) {
  const { username, mapId } = await params;

  if (isReservedUsername(username)) notFound();

  if (!ENV.ENABLE_CONTENT) {
    const map = await getMap(mapId);

    if (!map || map.user?.username !== username) notFound();

    const description =
      map.description ||
      `${map.user.display_name || map.user.username}のマップ`;

    return (
      <ShareLandingPage
        title={map.name}
        description={description}
        imageUrl={map.thumbnail_url}
        deepLink={DEEP_LINKS.map(mapId)}
      />
    );
  }

  return <MapArticlePage username={username} mapId={mapId} />;
}
