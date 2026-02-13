"use client";

import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/shared/ui/badge";
import { REPORT_REASON_LABELS } from "@/shared/config";
import type { Report } from "@/entities/report";

const columnHelper = createColumnHelper<Report>();

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return <Badge className="bg-amber-500">未対応</Badge>;
    case "reviewing":
      return <Badge className="bg-blue-500">確認中</Badge>;
    case "resolved":
      return <Badge className="bg-green-500">解決済</Badge>;
    case "dismissed":
      return <Badge variant="secondary">却下</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getTargetTypeBadge(targetType: string) {
  switch (targetType) {
    case "map":
      return <Badge variant="outline" className="text-purple-600 border-purple-600">マップ</Badge>;
    case "spot":
      return <Badge variant="outline" className="text-blue-600 border-blue-600">スポット</Badge>;
    case "user":
      return <Badge variant="outline" className="text-green-600 border-green-600">ユーザー</Badge>;
    case "comment":
      return <Badge variant="outline" className="text-gray-600 border-gray-600">コメント</Badge>;
    default:
      return <Badge variant="outline">{targetType}</Badge>;
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

export const reportColumns = [
  columnHelper.accessor("status", {
    header: "ステータス",
    size: 100,
    cell: ({ row }) => (
      <Link href={`/reports/${row.original.id}`}>
        {getStatusBadge(row.original.status)}
      </Link>
    ),
  }),
  columnHelper.accessor("target_type", {
    header: "対象タイプ",
    size: 100,
    cell: ({ row }) => (
      <Link href={`/reports/${row.original.id}`}>
        {getTargetTypeBadge(row.original.target_type)}
      </Link>
    ),
  }),
  columnHelper.accessor("target_name", {
    header: "対象名",
    size: 180,
    cell: ({ row }) => (
      <Link
        href={`/reports/${row.original.id}`}
        className="text-gray-700 hover:underline block truncate"
      >
        {row.original.target_name ?? "-"}
      </Link>
    ),
  }),
  columnHelper.accessor("reason", {
    header: "理由",
    size: 100,
    cell: ({ row }) => (
      <Link href={`/reports/${row.original.id}`} className="hover:underline">
        {REPORT_REASON_LABELS[row.original.reason] ?? row.original.reason}
      </Link>
    ),
  }),
  columnHelper.display({
    id: "reporter",
    header: "通報者",
    size: 120,
    cell: ({ row }) =>
      row.original.reporter ? (
        <Link
          href={`/users/${row.original.reporter.id}`}
          className="text-blue-600 hover:underline"
        >
          @{row.original.reporter.username}
        </Link>
      ) : (
        <span className="text-gray-400">-</span>
      ),
  }),
  columnHelper.accessor("description", {
    header: "説明",
    size: 200,
    cell: ({ getValue }) => {
      const desc = getValue();
      if (!desc) return <span className="text-gray-400">-</span>;
      return (
        <span className="text-gray-600 block truncate">
          {desc.length > 50 ? desc.slice(0, 50) + "..." : desc}
        </span>
      );
    },
  }),
  columnHelper.accessor("created_at", {
    header: "日時",
    size: 160,
    cell: ({ row }) => (
      <Link
        href={`/reports/${row.original.id}`}
        className="text-gray-600 whitespace-nowrap"
      >
        {formatDate(row.original.created_at)}
      </Link>
    ),
  }),
];
