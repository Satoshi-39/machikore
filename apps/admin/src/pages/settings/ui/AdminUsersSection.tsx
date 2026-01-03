import { Users } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { getAdminUsers } from "@/entities/admin-user";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getRoleBadge(role: string) {
  const config: Record<string, { label: string; className: string }> = {
    owner: { label: "オーナー", className: "bg-purple-500" },
    admin: { label: "管理者", className: "bg-blue-500" },
    moderator: { label: "モデレーター", className: "bg-green-500" },
  };
  const { label, className } = config[role] || { label: role, className: "bg-gray-500" };
  return <Badge className={className}>{label}</Badge>;
}

export async function AdminUsersSection() {
  const adminUsers = await getAdminUsers();

  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          管理者一覧
        </h2>
        <p className="text-sm text-gray-500">{adminUsers.length}人</p>
      </div>

      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ユーザー</TableHead>
              <TableHead>メールアドレス</TableHead>
              <TableHead>権限</TableHead>
              <TableHead>追加日</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminUsers.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {admin.user?.avatar_url && (
                        <AvatarImage src={admin.user.avatar_url} />
                      )}
                      <AvatarFallback>
                        {admin.user?.display_name?.charAt(0)?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {admin.user?.display_name || "-"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">
                  {admin.user?.email || "-"}
                </TableCell>
                <TableCell>{getRoleBadge(admin.role)}</TableCell>
                <TableCell className="text-gray-600">
                  {formatDate(admin.created_at)}
                </TableCell>
              </TableRow>
            ))}
            {adminUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                  管理者が見つかりません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        ※ 管理者の追加・削除機能は今後実装予定です。
      </p>
    </div>
  );
}
