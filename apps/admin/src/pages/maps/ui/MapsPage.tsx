import { Pagination } from "@/shared/ui/pagination";
import { DataTable } from "@/shared/ui/data-table";
import { getMaps } from "@/entities/map";
import { SearchForm } from "@/features/search";
import { MapVisibilityFilter, MapOfficialFilter } from "@/features/filter-maps";
import { parseFilterParam } from "@/shared/lib";
import { mapColumns } from "./columns";

type MapsPageProps = {
  searchParams?: {
    q?: string;
    visibility?: string;
    official?: string;
    page?: string;
  };
};

export async function MapsPage({ searchParams }: MapsPageProps) {
  const query = searchParams?.q;
  const visibilityValues = parseFilterParam(searchParams?.visibility);
  const officialValues = parseFilterParam(searchParams?.official);
  const page = Number(searchParams?.page) || 1;

  const { data: maps, totalCount, totalPages, perPage } = await getMaps({
    query,
    visibility: visibilityValues.length > 0 ? visibilityValues : undefined,
    official: officialValues.length > 0 ? officialValues : undefined,
    page,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">マップ管理</h1>
        <p className="text-sm text-gray-500">全{totalCount}件</p>
      </div>

      {/* Search and Filter */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchForm
            placeholder="マップ名で検索..."
            basePath="/maps"
          />
        </div>
        <div className="flex items-center gap-2">
          <MapVisibilityFilter selectedValues={visibilityValues} basePath="/maps" />
          <MapOfficialFilter selectedValues={officialValues} basePath="/maps" />
        </div>
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
