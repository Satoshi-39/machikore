import type { Metadata } from "next";
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
  params: Promise<{ username: string; mapId: string }>;
};

async function getMap(username: string, mapId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("maps")
    .select(
      `
      id,
      name,
      description,
      thumbnail_url,
      users!inner(username, display_name)
    `
    )
    .eq("id", mapId)
    .eq("is_public", true)
    .single();

  if (error || !data) return null;

  // URLのusernameとマップ所有者のusernameが一致するか確認
  const user = data.users as unknown as {
    username: string;
    display_name: string;
  };
  if (user.username !== username) return null;

  return { ...data, user };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, mapId } = await params;

  if (isReservedUsername(username)) return { title: "ページが見つかりません" };

  const map = await getMap(username, mapId);

  if (!map) {
    return { title: "マップが見つかりません" };
  }

  const title = `${map.name} - ${APP_NAME}`;
  const description = map.description || `${map.user.display_name}のマップ`;
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

  const map = await getMap(username, mapId);

  if (!map) notFound();

  const description = map.description || `${map.user.display_name}のマップ`;

  return (
    <ShareLandingPage
      title={map.name}
      description={description}
      imageUrl={map.thumbnail_url}
      deepLink={DEEP_LINKS.map(mapId)}
    />
  );
}
