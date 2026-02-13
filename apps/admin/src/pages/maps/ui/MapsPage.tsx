import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { Pagination } from "@/shared/ui/pagination";
import { Map, Heart, MessageSquare, Bookmark, MapPin } from "lucide-react";
import { getMaps } from "@/entities/map";

type MapsPageProps = {
  searchParams?: {
    page?: string;
  };
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export async function MapsPage({ searchParams }: MapsPageProps) {
  const page = Number(searchParams?.page) || 1;

  const { data: maps, totalCount, totalPages, perPage } = await getMaps({ page });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">マップ管理</h1>
        <p className="text-sm text-gray-500">全{totalCount}件</p>
      </div>

      <div className="mt-6 rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>マップ名</TableHead>
              <TableHead>作成者</TableHead>
              <TableHead>カテゴリ</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>統計</TableHead>
              <TableHead>作成日</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maps.map((map) => (
              <TableRow key={map.id}>
                <TableCell>
                  <Link
                    href={`/maps/${map.id}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <Map className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{map.name}</span>
                  </Link>
                </TableCell>
                <TableCell>
                  {map.user ? (
                    <Link
                      href={`/users/${map.user.username}`}
                      className="text-sm hover:underline"
                    >
                      <div className="font-medium">{map.user.display_name}</div>
                      <div className="text-gray-500">@{map.user.username}</div>
                    </Link>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {map.category ? (
                    <span className="text-sm">{map.category.name}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {map.is_public ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        公開
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                        非公開
                      </Badge>
                    )}
                    {map.is_official && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        公式
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1" title="スポット数">
                      <MapPin className="h-3.5 w-3.5" />
                      {map.spots_count}
                    </span>
                    <span className="flex items-center gap-1" title="いいね">
                      <Heart className="h-3.5 w-3.5" />
                      {map.likes_count}
                    </span>
                    <span className="flex items-center gap-1" title="コメント">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {map.comments_count}
                    </span>
                    <span className="flex items-center gap-1" title="ブックマーク">
                      <Bookmark className="h-3.5 w-3.5" />
                      {map.bookmarks_count}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">
                  {formatDate(map.created_at)}
                </TableCell>
              </TableRow>
            ))}
            {maps.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  マップが見つかりません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
        perPage={perPage}
        basePath="/maps"
      />
    </div>
  );
}
