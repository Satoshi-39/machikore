import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Calendar, Crown, MapPin, Map } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { getUserDetail, getUserMaps, getUserSpots } from "@/entities/user";

type UserDetailPageProps = {
  userId: string;
};

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
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(dateString: string) {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export async function UserDetailPage({ userId }: UserDetailPageProps) {
  const [user, maps, spots] = await Promise.all([
    getUserDetail(userId),
    getUserMaps(userId),
    getUserSpots(userId),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">ユーザー詳細</h1>
      </div>

      {/* User Profile Card */}
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar_url ?? undefined} />
            <AvatarFallback className="text-2xl">
              {user.display_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">{user.display_name}</h2>
              {getStatusBadge(user.status)}
              {user.is_premium && (
                <Badge className="bg-amber-500">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            <p className="text-gray-500">@{user.username}</p>
            {user.bio && (
              <p className="mt-2 text-gray-600">{user.bio}</p>
            )}
          </div>
        </div>

        {/* User Info Grid */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Mail className="h-4 w-4" />
              メールアドレス
            </div>
            <p className="mt-1 font-medium truncate">{user.email}</p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="h-4 w-4" />
              登録日
            </div>
            <p className="mt-1 font-medium">{formatDate(user.created_at)}</p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Map className="h-4 w-4" />
              作成マップ数
            </div>
            <p className="mt-1 font-medium">{maps.length}件</p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin className="h-4 w-4" />
              作成スポット数
            </div>
            <p className="mt-1 font-medium">{spots.length}件</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">年齢層:</span>
            <span className="ml-2">{user.age_group ?? "-"}</span>
          </div>
          <div>
            <span className="text-gray-500">性別:</span>
            <span className="ml-2">{user.gender ?? "-"}</span>
          </div>
          <div>
            <span className="text-gray-500">国:</span>
            <span className="ml-2">{user.country ?? "-"}</span>
          </div>
          <div>
            <span className="text-gray-500">都道府県:</span>
            <span className="ml-2">{user.prefecture ?? "-"}</span>
          </div>
        </div>

        {/* Premium Info */}
        {user.is_premium && (
          <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
            <h3 className="font-medium text-amber-800">プレミアム情報</h3>
            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-amber-600">開始日:</span>
                <span className="ml-2 text-amber-800">
                  {user.premium_started_at ? formatDateShort(user.premium_started_at) : "-"}
                </span>
              </div>
              <div>
                <span className="text-amber-600">有効期限:</span>
                <span className="ml-2 text-amber-800">
                  {user.premium_expires_at ? formatDateShort(user.premium_expires_at) : "-"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Suspended Info */}
        {user.status === "suspended" && (
          <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <h3 className="font-medium text-red-800">停止情報</h3>
            <div className="mt-2 text-sm">
              <div>
                <span className="text-red-600">停止日:</span>
                <span className="ml-2 text-red-800">
                  {user.suspended_at ? formatDate(user.suspended_at) : "-"}
                </span>
              </div>
              {user.suspended_reason && (
                <div className="mt-1">
                  <span className="text-red-600">理由:</span>
                  <span className="ml-2 text-red-800">{user.suspended_reason}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Maps */}
      <div className="rounded-lg border bg-white">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <Map className="h-4 w-4" />
            作成したマップ（最新10件）
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>タイトル</TableHead>
              <TableHead>公開状態</TableHead>
              <TableHead>作成日</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maps.map((map) => (
              <TableRow key={map.id}>
                <TableCell className="font-medium">{map.name}</TableCell>
                <TableCell>
                  {map.is_public ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">公開</Badge>
                  ) : (
                    <Badge variant="secondary">非公開</Badge>
                  )}
                </TableCell>
                <TableCell className="text-gray-600">
                  {formatDateShort(map.created_at)}
                </TableCell>
              </TableRow>
            ))}
            {maps.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                  マップがありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* User Spots */}
      <div className="rounded-lg border bg-white">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            作成したスポット（最新10件）
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>スポット名</TableHead>
              <TableHead>作成日</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spots.map((spot) => (
              <TableRow key={spot.id}>
                <TableCell className="font-medium">{spot.custom_name}</TableCell>
                <TableCell className="text-gray-600">
                  {formatDateShort(spot.created_at)}
                </TableCell>
              </TableRow>
            ))}
            {spots.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-gray-500 py-8">
                  スポットがありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
