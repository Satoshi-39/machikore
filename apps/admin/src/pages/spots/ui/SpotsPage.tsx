import { Pagination } from "@/shared/ui/pagination";
import { DataTable } from "@/shared/ui/data-table";
import { getSpots } from "@/entities/user-spot";
import { SearchForm } from "@/features/search";
import { spotColumns } from "./columns";

type SpotsPageProps = {
  searchParams?: {
    q?: string;
    page?: string;
  };
};

export async function SpotsPage({ searchParams }: SpotsPageProps) {
  const query = searchParams?.q;
  const page = Number(searchParams?.page) || 1;

  const { data: spots, totalCount, totalPages, perPage } = await getSpots({
    query,
    page,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">スポット管理</h1>
        <p className="text-sm text-gray-500">全{totalCount}件</p>
      </div>

      {/* Search */}
      <div className="mt-6">
        <SearchForm
          placeholder="スポット名で検索..."
          basePath="/spots"
        />
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
