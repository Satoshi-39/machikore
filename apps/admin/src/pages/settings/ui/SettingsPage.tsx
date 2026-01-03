import { Shield, Database, Bell } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { getCurrentAdmin } from "@/entities/admin-user";
import { AdminUsersSection } from "./AdminUsersSection";

export async function SettingsPage() {
  const admin = await getCurrentAdmin();
  const isOwner = admin?.role === "owner";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="mt-2 text-gray-600">システム設定と管理者管理</p>
      </div>

      {/* 現在のユーザー情報 */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          現在のアカウント
        </h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-600">表示名</span>
            <span className="font-medium">{admin?.displayName ?? "-"}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-600">メールアドレス</span>
            <span className="font-medium">{admin?.email ?? "-"}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">権限</span>
            <Badge className={getRoleBadgeClass(admin?.role ?? "admin")}>
              {getRoleLabel(admin?.role ?? "admin")}
            </Badge>
          </div>
        </div>
      </div>

      {/* 管理者一覧（ownerのみ表示） */}
      {isOwner && <AdminUsersSection />}

      {/* その他の設定セクション（プレースホルダー） */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          通知設定
        </h2>
        <p className="mt-2 text-gray-500 text-sm">
          通知設定は今後実装予定です。
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Database className="h-5 w-5" />
          システム情報
        </h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-600">アプリケーション</span>
            <span className="font-medium">Machikore Admin</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-600">バージョン</span>
            <span className="font-medium">0.1.0</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">環境</span>
            <span className="font-medium">{process.env.NODE_ENV}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getRoleBadgeClass(role: string): string {
  const classes: Record<string, string> = {
    owner: "bg-purple-500",
    admin: "bg-blue-500",
    moderator: "bg-green-500",
  };
  return classes[role] || "bg-gray-500";
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    owner: "オーナー",
    admin: "管理者",
    moderator: "モデレーター",
  };
  return labels[role] || role;
}
