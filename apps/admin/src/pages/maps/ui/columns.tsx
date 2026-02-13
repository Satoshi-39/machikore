"use client";

import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/shared/ui/badge";
import { Map, Heart, MessageSquare, Bookmark, MapPin } from "lucide-react";
import type { Map as MapType } from "@/entities/map";

const columnHelper = createColumnHelper<MapType>();

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export const mapColumns = [
  columnHelper.accessor("name", {
    header: "マップ名",
    size: 200,
    cell: ({ row }) => (
      <Link
        href={`/maps/${row.original.id}`}
        className="flex items-center gap-2 hover:underline"
      >
        <Map className="h-4 w-4 text-gray-400 shrink-0" />
        <span className="font-medium truncate">{row.original.name}</span>
      </Link>
    ),
  }),
  columnHelper.display({
    id: "user",
    header: "作成者",
    size: 150,
    cell: ({ row }) =>
      row.original.user ? (
        <Link
          href={`/users/${row.original.user.username}`}
          className="text-sm hover:underline"
        >
          <div className="font-medium">{row.original.user.display_name}</div>
          <div className="text-gray-500">@{row.original.user.username}</div>
        </Link>
      ) : (
        <span className="text-gray-400">-</span>
      ),
  }),
  columnHelper.display({
    id: "category",
    header: "カテゴリ",
    size: 120,
    cell: ({ row }) =>
      row.original.category ? (
        <span className="text-sm">{row.original.category.name}</span>
      ) : (
        <span className="text-gray-400">-</span>
      ),
  }),
  columnHelper.display({
    id: "status",
    header: "ステータス",
    size: 130,
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.is_public ? (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            公開
          </Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-600 border-gray-200">
            非公開
          </Badge>
        )}
        {row.original.is_official && (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            公式
          </Badge>
        )}
      </div>
    ),
  }),
  columnHelper.display({
    id: "stats",
    header: "統計",
    size: 200,
    cell: ({ row }) => (
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span className="flex items-center gap-1" title="スポット数">
          <MapPin className="h-3.5 w-3.5" />
          {row.original.spots_count}
        </span>
        <span className="flex items-center gap-1" title="いいね">
          <Heart className="h-3.5 w-3.5" />
          {row.original.likes_count}
        </span>
        <span className="flex items-center gap-1" title="コメント">
          <MessageSquare className="h-3.5 w-3.5" />
          {row.original.comments_count}
        </span>
        <span className="flex items-center gap-1" title="ブックマーク">
          <Bookmark className="h-3.5 w-3.5" />
          {row.original.bookmarks_count}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor("created_at", {
    header: "作成日",
    size: 120,
    cell: ({ row }) => (
      <span className="text-gray-600 whitespace-nowrap">
        {formatDate(row.original.created_at)}
      </span>
    ),
  }),
];
