import { Pagination } from "@/shared/ui/pagination";
import { DataTable } from "@/shared/ui/data-table";
import { getSpots } from "@/entities/user-spot";
import { spotColumns } from "./columns";

type SpotsPageProps = {
  searchParams?: {
    page?: string;
  };
};

export async function SpotsPage({ searchParams }: SpotsPageProps) {
  const page = Number(searchParams?.page) || 1;

  const { data: spots, totalCount, totalPages, perPage } = await getSpots({ page });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">スポット管理</h1>
        <p className="text-sm text-gray-500">全{totalCount}件</p>
      </div>

      <div className="mt-6 rounded-lg border bg-white">
        <DataTable
          columns={spotColumns}
          data={spots}
          emptyMessage="スポットが見つかりません"
        />
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
        perPage={perPage}
        basePath="/spots"
      />
    </div>
  );
}
