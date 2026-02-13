import { UsersPage } from "@/pages/users";

type Props = {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  return <UsersPage searchParams={params} />;
}
