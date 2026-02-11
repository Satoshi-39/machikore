import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSpotForShare } from "@/shared/api/supabase/spots";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, mapId, spotId } = await params;

  if (isReservedUsername(username))
    return { title: "ページが見つかりません" };

  const spot = await getSpotForShare(username, mapId, spotId);

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

  const spot = await getSpotForShare(username, mapId, spotId);

  if (!spot) notFound();

  const spotTitle = spot.description || spot.spotName;
  const spotDescription = `${spot.authorName}の「${spot.mapName}」に掲載`;

  return (
    <ShareLandingPage
      title={spotTitle}
      description={spotDescription}
      imageUrl={spot.imageUrl}
      deepLink={DEEP_LINKS.spot(spotId)}
    />
  );
}
