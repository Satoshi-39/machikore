import { Pagination } from "@/shared/ui/pagination";
import { DataTable } from "@/shared/ui/data-table";
import { getMachis } from "@/entities/machi";
import { machiColumns } from "./columns";

type MachiPageProps = {
  searchParams?: {
    page?: string;
  };
};

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
        <DataTable
          columns={machiColumns}
          data={machis}
          emptyMessage="街が見つかりません"
        />
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
