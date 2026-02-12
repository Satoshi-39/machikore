import { ReportsPage } from "@/pages/reports";

type Props = {
  searchParams: Promise<{ status?: string; target_type?: string; page?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  return <ReportsPage searchParams={params} />;
}
