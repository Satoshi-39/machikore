import { UserDetailPage } from "@/pages/users/ui/UserDetailPage";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <UserDetailPage userId={id} />;
}
