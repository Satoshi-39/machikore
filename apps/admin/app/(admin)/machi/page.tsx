import { MachiPage } from "@/pages/machi";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  return <MachiPage searchParams={params} />;
}
