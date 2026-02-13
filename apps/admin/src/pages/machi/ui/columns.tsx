"use client";

import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/shared/ui/badge";
import { MapPin } from "lucide-react";
import { getPlaceTypeLabel } from "@/shared/config";
import type { Machi } from "@/entities/machi";

const columnHelper = createColumnHelper<Machi>();

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export const machiColumns = [
  columnHelper.accessor("name", {
    header: "街名",
    size: 160,
    cell: ({ row }) => (
      <Link
        href={`/machi/${row.original.id}`}
        className="flex items-center gap-2 hover:underline"
      >
        <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
        <span className="font-medium">{row.original.name}</span>
      </Link>
    ),
  }),
  columnHelper.accessor("name_kana", {
    header: "読み仮名",
    size: 140,
    cell: ({ getValue }) => (
      <span className="text-gray-600">{getValue() || "-"}</span>
    ),
  }),
  columnHelper.accessor("prefecture_name", {
    header: "都道府県",
    size: 100,
    cell: ({ getValue }) => (
      <span className="text-gray-600">{getValue()}</span>
    ),
  }),
  columnHelper.accessor("city_name", {
    header: "市区町村",
    size: 120,
    cell: ({ getValue }) => (
      <span className="text-gray-600">{getValue() || "-"}</span>
    ),
  }),
  columnHelper.accessor("place_type", {
    header: "種別",
    size: 100,
    cell: ({ row }) =>
      row.original.place_type ? (
        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
          {getPlaceTypeLabel(row.original.place_type)}
        </Badge>
      ) : (
        <span className="text-gray-400">-</span>
      ),
  }),
  columnHelper.display({
    id: "coordinates",
    header: "座標",
    size: 160,
    cell: ({ row }) =>
      row.original.latitude && row.original.longitude ? (
        <a
          href={`https://www.google.com/maps?q=${row.original.latitude},${row.original.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm"
        >
          {row.original.latitude.toFixed(4)}, {row.original.longitude.toFixed(4)}
        </a>
      ) : (
        <span className="text-gray-400">-</span>
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
