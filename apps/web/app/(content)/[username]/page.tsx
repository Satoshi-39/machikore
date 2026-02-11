import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserByUsername } from "@/shared/api/supabase/users";
import {
  APP_NAME,
  DEFAULT_OGP_IMAGE,
  WEB_URLS,
  isReservedUsername,
} from "@/shared/config";
import { ShareLandingPage } from "@/shared/ui";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;

  if (isReservedUsername(username)) return { title: "ページが見つかりません" };

  const user = await getUserByUsername(username);

  if (!user) {
    return { title: "ユーザーが見つかりません" };
  }

  const displayName = user.display_name || user.username;
  const title = `${displayName} - ${APP_NAME}`;
  const description = user.bio || `${displayName}のプロフィール`;
  const imageUrl = user.avatar_url || DEFAULT_OGP_IMAGE;
  const url = WEB_URLS.profile(username);

  return {
    title,
    description,
    openGraph: {
      title: displayName,
      description,
      images: [{ url: imageUrl }],
      url,
      type: "profile",
      siteName: APP_NAME,
      locale: "ja_JP",
    },
    twitter: {
      card: "summary",
      title: displayName,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  if (isReservedUsername(username)) notFound();

  const user = await getUserByUsername(username);

  if (!user) notFound();

  const displayName = user.display_name || user.username;
  const description = user.bio || `${displayName}のプロフィール`;

  return (
    <ShareLandingPage
      title={displayName}
      description={description}
      imageUrl={user.avatar_url}
      deepLink={`machikore://users/${username}`}
    />
  );
}
