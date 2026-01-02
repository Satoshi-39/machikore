import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { MapPin, Heart, MessageSquare, Bookmark } from "lucide-react";
import { getSpots } from "@/entities/user-spot";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export async function SpotsPage() {
  const spots = await getSpots();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">スポット管理</h1>
        <p className="text-sm text-gray-500">{spots.length}件表示</p>
      </div>

      <div className="mt-6 rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>スポット名</TableHead>
              <TableHead>場所</TableHead>
              <TableHead>作成者</TableHead>
              <TableHead>エンゲージメント</TableHead>
              <TableHead>作成日</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spots.map((spot) => (
              <TableRow key={spot.id}>
                <TableCell>
                  <Link
                    href={`/spots/${spot.id}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{spot.custom_name}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-gray-600">
                  <div className="text-sm">
                    {spot.prefecture_name && (
                      <span>{spot.prefecture_name}</span>
                    )}
                    {spot.machi_name && (
                      <span className="text-gray-400"> / {spot.machi_name}</span>
                    )}
                    {!spot.prefecture_name && !spot.machi_name && (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {spot.user ? (
                    <Link
                      href={`/users/${spot.id}`}
                      className="text-sm hover:underline"
                    >
                      <div className="font-medium">{spot.user.display_name}</div>
                      <div className="text-gray-500">@{spot.user.username}</div>
                    </Link>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      {spot.likes_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {spot.comments_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bookmark className="h-3.5 w-3.5" />
                      {spot.bookmarks_count}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">
                  {formatDate(spot.created_at)}
                </TableCell>
              </TableRow>
            ))}
            {spots.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  スポットが見つかりません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
