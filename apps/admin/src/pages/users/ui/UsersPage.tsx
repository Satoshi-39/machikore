import { Pagination } from "@/shared/ui/pagination";
import { DataTable } from "@/shared/ui/data-table";
import { getUsers } from "@/entities/user";
import { SearchForm } from "@/features/search";
import { UserStatusFilter, UserPremiumFilter, UserDateFilter } from "@/features/filter-users";
import { parseFilterParam } from "@/shared/lib";
import { userColumns } from "./columns";

type UsersPageProps = {
  searchParams?: {
    q?: string;
    status?: string;
    premium?: string;
    date_from?: string;
    date_to?: string;
    page?: string;
  };
};

export async function UsersPage({ searchParams }: UsersPageProps) {
  const query = searchParams?.q;
  const statusValues = parseFilterParam(searchParams?.status);
  const premiumValues = parseFilterParam(searchParams?.premium);
  const dateFrom = searchParams?.date_from;
  const dateTo = searchParams?.date_to;
  const page = Number(searchParams?.page) || 1;

  const { data: users, totalCount, totalPages, perPage } = await getUsers({
    query,
    status: statusValues.length > 0 ? statusValues : undefined,
    premium: premiumValues.length > 0 ? premiumValues : undefined,
    dateFrom,
    dateTo,
    page,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
        <p className="text-sm text-gray-500">全{totalCount}件</p>
      </div>

      {/* Search and Filter */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchForm
            placeholder="ユーザー名、表示名、メールで検索..."
            basePath="/users"
          />
        </div>
        <div className="flex items-center gap-2">
          <UserStatusFilter selectedValues={statusValues} basePath="/users" />
          <UserPremiumFilter selectedValues={premiumValues} basePath="/users" />
          <UserDateFilter currentFrom={dateFrom} currentTo={dateTo} basePath="/users" />
        </div>
      </div>

      <div className="mt-6 rounded-lg border bg-white">
        <DataTable
          columns={userColumns}
          data={users}
          emptyMessage="ユーザーが見つかりません"
        />
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
        perPage={perPage}
        basePath="/users"
      />
    </div>
  );
}
