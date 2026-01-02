import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { getUsers } from "@/entities/user";

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">アクティブ</Badge>;
    case "suspended":
      return <Badge variant="destructive">停止中</Badge>;
    case "deleted":
      return <Badge variant="secondary">削除済み</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
        <p className="text-sm text-gray-500">{users.length}件表示</p>
      </div>

      <div className="mt-6 rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ユーザー</TableHead>
              <TableHead>メールアドレス</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>プレミアム</TableHead>
              <TableHead>登録日</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="cursor-pointer">
                <TableCell>
                  <Link href={`/users/${user.id}`} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url ?? undefined} />
                      <AvatarFallback>
                        {user.display_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium hover:underline">{user.display_name}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="text-gray-600">{user.email}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  {user.is_premium ? (
                    <Badge className="bg-amber-500">Premium</Badge>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-gray-600">
                  {formatDate(user.created_at)}
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  ユーザーが見つかりません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
