import { MapViewPage } from "@/pages/map-view";

type Props = {
  params: Promise<{ username: string; mapId: string }>;
};

export default async function MapViewRoute({ params }: Props) {
  const { username, mapId } = await params;

  return <MapViewPage username={username} mapId={mapId} />;
}
