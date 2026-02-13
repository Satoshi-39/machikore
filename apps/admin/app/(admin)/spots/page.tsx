import { SpotsPage } from "@/pages/spots";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  return <SpotsPage searchParams={params} />;
}
