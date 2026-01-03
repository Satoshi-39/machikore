import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Heart,
  MessageSquare,
  Bookmark,
  Calendar,
  User,
  Map,
} from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { getSpotDetail } from "@/entities/user-spot";

type SpotDetailPageProps = {
  spotId: string;
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

export async function SpotDetailPage({ spotId }: SpotDetailPageProps) {
  const spot = await getSpotDetail(spotId);

  if (!spot) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/spots">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">スポット詳細</h1>
      </div>

      {/* Spot Info Card */}
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
            <MapPin className="h-6 w-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{spot.description}</h2>
            {spot.description && (
              <p className="mt-2 text-gray-600">{spot.description}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span>{spot.likes_count} いいね</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            <span>{spot.comments_count} コメント</span>
          </div>
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-amber-500" />
            <span>{spot.bookmarks_count} ブックマーク</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin className="h-4 w-4" />
              場所
            </div>
            <div className="mt-1">
              <p className="font-medium">
                {spot.prefecture_name || "-"}
                {spot.city_name && ` ${spot.city_name}`}
                {spot.machi_name && ` ${spot.machi_name}`}
              </p>
              {spot.google_formatted_address && (
                <p className="text-sm text-gray-500 mt-1">
                  {spot.google_formatted_address}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <User className="h-4 w-4" />
              作成者
            </div>
            {spot.user ? (
              <Link
                href={`/users/${spot.user.id}`}
                className="mt-1 block hover:underline"
              >
                <p className="font-medium">{spot.user.display_name}</p>
                <p className="text-sm text-gray-500">@{spot.user.username}</p>
              </Link>
            ) : (
              <p className="mt-1 text-gray-400">-</p>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Map className="h-4 w-4" />
              所属マップ
            </div>
            {spot.map ? (
              <Link
                href={`/maps/${spot.map.id}`}
                className="mt-1 block hover:underline"
              >
                <p className="font-medium">{spot.map.name}</p>
              </Link>
            ) : (
              <p className="mt-1 text-gray-400">-</p>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="h-4 w-4" />
              作成日時
            </div>
            <p className="mt-1 font-medium">{formatDate(spot.created_at)}</p>
            <p className="text-sm text-gray-500">
              更新: {formatDate(spot.updated_at)}
            </p>
          </div>
        </div>

        {/* Coordinates */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <div className="text-sm text-gray-500 mb-2">座標</div>
          <div className="flex items-center gap-4 text-sm">
            <span>緯度: {spot.latitude}</span>
            <span>経度: {spot.longitude}</span>
            <a
              href={`https://www.google.com/maps?q=${spot.latitude},${spot.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google Mapで開く
            </a>
          </div>
        </div>

        {/* Images count */}
        {spot.images_count > 0 && (
          <div className="mt-6">
            <Badge variant="secondary">
              {spot.images_count}枚の画像
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
