import { Pagination } from "@/shared/ui/pagination";
import { DataTable } from "@/shared/ui/data-table";
import { getMaps } from "@/entities/map";
import { mapColumns } from "./columns";

type MapsPageProps = {
  searchParams?: {
    page?: string;
  };
};

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
        <DataTable
          columns={mapColumns}
          data={maps}
          emptyMessage="マップが見つかりません"
        />
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
