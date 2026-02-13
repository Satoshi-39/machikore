import { notFound } from "next/navigation";
import { getMap } from "@/shared/api/supabase/maps";
import { DEEP_LINKS, ENV, isReservedUsername } from "@/shared/config";
import { MapViewPage } from "@/pages/map-view";
import { ShareLandingPage } from "@/shared/ui";

type Props = {
  params: Promise<{ username: string; mapId: string }>;
};

export default async function MapViewRoute({ params }: Props) {
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

  return <MapViewPage username={username} mapId={mapId} />;
}
