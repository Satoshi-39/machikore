import { MapsPage } from "@/pages/maps";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  return <MapsPage searchParams={params} />;
}
