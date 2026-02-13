import { Pagination } from "@/shared/ui/pagination";
import { DataTable } from "@/shared/ui/data-table";
import { getReports } from "@/entities/report";
import type { Database } from "@machikore/database";
import { ReportStatusFilter, ReportTargetTypeFilter } from "@/features/filter-reports";
import { parseFilterParam } from "@/shared/lib";
import { reportColumns } from "./columns";

type ReportStatus = Database["public"]["Enums"]["report_status"];
type ReportTargetType = Database["public"]["Enums"]["report_target_type"];

type ReportsPageProps = {
  searchParams?: {
    status?: string;
    target_type?: string;
    page?: string;
  };
};

export async function ReportsPage({ searchParams }: ReportsPageProps) {
  const statusValues = parseFilterParam(searchParams?.status);
  const targetTypeValues = parseFilterParam(searchParams?.target_type);
  const page = Number(searchParams?.page) || 1;

  const {
    data: reports,
    totalCount,
    totalPages,
    perPage,
  } = await getReports({
    status: statusValues.length > 0 ? statusValues as ReportStatus[] : undefined,
    targetType: targetTypeValues.length > 0 ? targetTypeValues as ReportTargetType[] : undefined,
    page,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">報告管理</h1>
        <p className="text-sm text-gray-500">全{totalCount}件</p>
      </div>

      {/* Filters */}
      <div className="mt-6 flex items-center gap-2">
        <ReportStatusFilter selectedValues={statusValues} />
        <ReportTargetTypeFilter selectedValues={targetTypeValues} />
      </div>

      <div className="mt-6 rounded-lg border bg-white">
        <DataTable
          columns={reportColumns}
          data={reports}
          emptyMessage="通報が見つかりません"
        />
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
