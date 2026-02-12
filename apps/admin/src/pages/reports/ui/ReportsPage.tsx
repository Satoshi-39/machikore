import Link from "next/link";
import { Badge } from "@/shared/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Pagination } from "@/shared/ui/pagination";
import { getReports } from "@/entities/report";
import {
  REPORT_STATUS_LABELS,
  REPORT_REASON_LABELS,
  REPORT_TARGET_TYPE_LABELS,
} from "@/shared/config";
import { ReportStatusFilter, ReportTargetTypeFilter } from "@/features/filter-reports";

type ReportsPageProps = {
  searchParams?: {
    status?: string;
    target_type?: string;
    page?: string;
  };
};

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

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export async function ReportsPage({ searchParams }: ReportsPageProps) {
  const status = searchParams?.status;
  const targetType = searchParams?.target_type;
  const page = Number(searchParams?.page) || 1;

  const {
    data: reports,
    totalCount,
    totalPages,
    perPage,
  } = await getReports({
    status,
    targetType,
    page,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">報告管理</h1>
        <p className="text-sm text-gray-500">全{totalCount}件</p>
      </div>

      {/* Filters */}
      <div className="mt-6 space-y-3">
        <div>
          <span className="text-sm text-gray-500 mr-2">ステータス:</span>
          <ReportStatusFilter
            currentStatus={status}
            currentTargetType={targetType}
          />
        </div>
        <div>
          <span className="text-sm text-gray-500 mr-2">対象タイプ:</span>
          <ReportTargetTypeFilter
            currentStatus={status}
            currentTargetType={targetType}
          />
        </div>
      </div>

      {/* Active Filters */}
      {(status || targetType) && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-gray-500">フィルター:</span>
          {status && (
            <Badge variant="secondary">
              ステータス: {REPORT_STATUS_LABELS[status] ?? status}
            </Badge>
          )}
          {targetType && (
            <Badge variant="secondary">
              対象: {REPORT_TARGET_TYPE_LABELS[targetType] ?? targetType}
            </Badge>
          )}
          <Link href="/reports" className="text-blue-600 hover:underline">
            クリア
          </Link>
        </div>
      )}

      <div className="mt-6 rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ステータス</TableHead>
              <TableHead>対象タイプ</TableHead>
              <TableHead>理由</TableHead>
              <TableHead>通報者</TableHead>
              <TableHead>説明</TableHead>
              <TableHead>日時</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id} className="cursor-pointer">
                <TableCell>
                  <Link href={`/reports/${report.id}`}>
                    {getStatusBadge(report.status)}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/reports/${report.id}`}>
                    {getTargetTypeBadge(report.target_type)}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/reports/${report.id}`}
                    className="hover:underline"
                  >
                    {REPORT_REASON_LABELS[report.reason] ?? report.reason}
                  </Link>
                </TableCell>
                <TableCell>
                  {report.reporter ? (
                    <Link
                      href={`/users/${report.reporter.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      @{report.reporter.username}
                    </Link>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-gray-600 max-w-[200px]">
                  <Link href={`/reports/${report.id}`}>
                    {report.description
                      ? truncate(report.description, 50)
                      : "-"}
                  </Link>
                </TableCell>
                <TableCell className="text-gray-600 whitespace-nowrap">
                  <Link href={`/reports/${report.id}`}>
                    {formatDate(report.created_at)}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {reports.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-500 py-8"
                >
                  通報が見つかりません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
        perPage={perPage}
        basePath="/reports"
      />
    </div>
  );
}
