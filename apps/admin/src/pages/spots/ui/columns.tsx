"use client";

import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { MapPin, Heart, MessageSquare, Bookmark } from "lucide-react";
import type { Spot } from "@/entities/user-spot";

const columnHelper = createColumnHelper<Spot>();

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export const spotColumns = [
  columnHelper.accessor("description", {
    header: "スポット名",
    size: 200,
    cell: ({ row }) => (
      <Link
        href={`/spots/${row.original.id}`}
        className="flex items-center gap-2 hover:underline"
      >
        <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
        <span className="font-medium truncate">{row.original.description}</span>
      </Link>
    ),
  }),
  columnHelper.display({
    id: "location",
    header: "場所",
    size: 180,
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {row.original.prefecture_name && (
          <span>{row.original.prefecture_name}</span>
        )}
        {row.original.machi_name && (
          <span className="text-gray-400"> / {row.original.machi_name}</span>
        )}
        {!row.original.prefecture_name && !row.original.machi_name && (
          <span className="text-gray-400">-</span>
        )}
      </div>
    ),
  }),
  columnHelper.display({
    id: "user",
    header: "作成者",
    size: 150,
    cell: ({ row }) =>
      row.original.user ? (
        <Link
          href={`/users/${row.original.id}`}
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
    id: "engagement",
    header: "エンゲージメント",
    size: 180,
    cell: ({ row }) => (
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <Heart className="h-3.5 w-3.5" />
          {row.original.likes_count}
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3.5 w-3.5" />
          {row.original.comments_count}
        </span>
        <span className="flex items-center gap-1">
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
