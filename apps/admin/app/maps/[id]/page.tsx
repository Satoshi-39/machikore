import { MapDetailPage } from "@/pages/maps/ui/MapDetailPage";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <MapDetailPage mapId={id} />;
}
