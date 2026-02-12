import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Map,
  Heart,
  MessageSquare,
  Bookmark,
  Calendar,
  User,
  MapPin,
  Tag,
  Globe,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { getMapDetail } from "@/entities/map";

type MapDetailPageProps = {
  mapId: string;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function MapDetailPage({ mapId }: MapDetailPageProps) {
  const map = await getMapDetail(mapId);

  if (!map) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/maps">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">マップ詳細</h1>
      </div>

      {/* Map Info Card */}
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-start gap-4">
          {map.thumbnail_url ? (
            <img
              src={map.thumbnail_url}
              alt={map.name}
              className="h-20 w-20 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100">
              <Map className="h-8 w-8 text-gray-600" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{map.name}</h2>
              {map.is_official && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Shield className="h-3 w-3 mr-1" />
                  公式
                </Badge>
              )}
            </div>
            {map.description && (
              <p className="mt-2 text-gray-600">{map.description}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {map.is_public ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Eye className="h-3 w-3 mr-1" />
                  公開
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                  <EyeOff className="h-3 w-3 mr-1" />
                  非公開
                </Badge>
              )}
              {map.language && (
                <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                  <Globe className="h-3 w-3 mr-1" />
                  {map.language}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{map.spots_count} スポット</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span>{map.likes_count} いいね</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            <span>{map.comments_count} コメント</span>
          </div>
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-amber-500" />
            <span>{map.bookmarks_count} ブックマーク</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <User className="h-4 w-4" />
              作成者
            </div>
            {map.user ? (
              <Link
                href={`/users/${map.user.id}`}
                className="mt-1 block hover:underline"
              >
                <p className="font-medium">{map.user.display_name}</p>
                <p className="text-sm text-gray-500">@{map.user.username}</p>
              </Link>
            ) : (
              <p className="mt-1 text-gray-400">-</p>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Tag className="h-4 w-4" />
              カテゴリ
            </div>
            {map.category ? (
              <p className="mt-1 font-medium">{map.category.name}</p>
            ) : (
              <p className="mt-1 text-gray-400">-</p>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="h-4 w-4" />
              作成日時
            </div>
            <p className="mt-1 font-medium">{formatDate(map.created_at)}</p>
            <p className="text-sm text-gray-500">
              更新: {formatDate(map.updated_at)}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              設定
            </div>
            <div className="mt-1 space-y-1">
              <p className="text-sm">
                ラベルチップ表示: {map.show_label_chips ? "有効" : "無効"}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {map.tags.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <Tag className="h-4 w-4" />
              タグ
            </div>
            <div className="flex flex-wrap gap-2">
              {map.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="bg-gray-100"
                >
                  #{tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Labels */}
        {map.labels.length > 0 && (
          <div className="mt-6">
            <div className="text-gray-500 text-sm mb-2">ラベル</div>
            <div className="flex flex-wrap gap-2">
              {map.labels.map((label) => (
                <Badge
                  key={label.id}
                  style={{
                    backgroundColor: getLabelColor(label.color),
                    color: getLabelTextColor(label.color),
                  }}
                >
                  {label.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getLabelColor(color: string): string {
  const colors: Record<string, string> = {
    pink: "#fce7f3",
    red: "#fee2e2",
    orange: "#fed7aa",
    yellow: "#fef3c7",
    green: "#d1fae5",
    blue: "#dbeafe",
    purple: "#e9d5ff",
    gray: "#e5e7eb",
    white: "#ffffff",
  };
  return colors[color] || colors.gray;
}

function getLabelTextColor(color: string): string {
  const colors: Record<string, string> = {
    pink: "#be185d",
    red: "#991b1b",
    orange: "#c2410c",
    yellow: "#a16207",
    green: "#047857",
    blue: "#1e40af",
    purple: "#7c3aed",
    gray: "#374151",
    white: "#374151",
  };
  return colors[color] || colors.gray;
}
