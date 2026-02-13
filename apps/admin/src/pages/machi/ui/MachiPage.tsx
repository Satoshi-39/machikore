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
import { MapPin } from "lucide-react";
import { getMachis } from "@/entities/machi";
import { getPlaceTypeLabel } from "@/shared/config";

type MachiPageProps = {
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

export async function MachiPage({ searchParams }: MachiPageProps) {
  const page = Number(searchParams?.page) || 1;

  const { data: machis, totalCount, totalPages, perPage } = await getMachis({ page });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">街管理</h1>
        <p className="text-sm text-gray-500">全{totalCount}件</p>
      </div>

      <div className="mt-6 rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>街名</TableHead>
              <TableHead>読み仮名</TableHead>
              <TableHead>都道府県</TableHead>
              <TableHead>市区町村</TableHead>
              <TableHead>種別</TableHead>
              <TableHead>座標</TableHead>
              <TableHead>作成日</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {machis.map((machi) => (
              <TableRow key={machi.id}>
                <TableCell>
                  <Link
                    href={`/machi/${machi.id}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{machi.name}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-gray-600">
                  {machi.name_kana || "-"}
                </TableCell>
                <TableCell className="text-gray-600">
                  {machi.prefecture_name}
                </TableCell>
                <TableCell className="text-gray-600">
                  {machi.city_name || "-"}
                </TableCell>
                <TableCell>
                  {machi.place_type ? (
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-700"
                    >
                      {getPlaceTypeLabel(machi.place_type)}
                    </Badge>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-gray-600 text-sm">
                  {machi.latitude && machi.longitude ? (
                    <a
                      href={`https://www.google.com/maps?q=${machi.latitude},${machi.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {machi.latitude.toFixed(4)}, {machi.longitude.toFixed(4)}
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-gray-600">
                  {formatDate(machi.created_at)}
                </TableCell>
              </TableRow>
            ))}
            {machis.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  街が見つかりません
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
        basePath="/machi"
      />
    </div>
  );
}
