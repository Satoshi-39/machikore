"use client";

import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import type { User } from "@/entities/user";

const columnHelper = createColumnHelper<User>();

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

export const userColumns = [
  columnHelper.display({
    id: "user",
    header: "ユーザー",
    size: 220,
    cell: ({ row }) => (
      <Link href={`/users/${row.original.id}`} className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={row.original.avatar_url ?? undefined} />
          <AvatarFallback>
            {row.original.display_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium hover:underline">{row.original.display_name}</div>
          <div className="text-sm text-gray-500">@{row.original.username}</div>
        </div>
      </Link>
    ),
  }),
  columnHelper.accessor("email", {
    header: "メールアドレス",
    size: 220,
    cell: ({ row }) => (
      <Link href={`/users/${row.original.id}`} className="text-gray-600 hover:underline">
        {row.original.email}
      </Link>
    ),
  }),
  columnHelper.accessor("status", {
    header: "ステータス",
    size: 110,
    cell: ({ row }) => getStatusBadge(row.original.status),
  }),
  columnHelper.accessor("is_premium", {
    header: "プレミアム",
    size: 100,
    cell: ({ row }) =>
      row.original.is_premium ? (
        <Badge className="bg-amber-500">Premium</Badge>
      ) : (
        <span className="text-gray-400">-</span>
      ),
  }),
  columnHelper.accessor("created_at", {
    header: "登録日",
    size: 120,
    cell: ({ row }) => (
      <span className="text-gray-600 whitespace-nowrap">
        {formatDate(row.original.created_at)}
      </span>
    ),
  }),
];
