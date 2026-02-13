import { SpotDetailPage } from "@/pages/spots/ui/SpotDetailPage";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <SpotDetailPage spotId={id} />;
}
