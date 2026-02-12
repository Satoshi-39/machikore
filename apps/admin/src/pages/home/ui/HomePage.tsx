import { Users, MapPin, Building2, Map, Flag } from "lucide-react";
import { createServerClient } from "@/shared/api";
import { getPendingReportsCount } from "@/entities/report";

async function getStats() {
  const supabase = await createServerClient();

  const [usersResult, spotsResult, machiResult, mapsResult, pendingReports] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("user_spots").select("*", { count: "exact", head: true }),
    supabase.from("machi").select("*", { count: "exact", head: true }),
    supabase.from("maps").select("*", { count: "exact", head: true }),
    getPendingReportsCount(),
  ]);

  return {
    users: usersResult.count ?? 0,
    spots: spotsResult.count ?? 0,
    machi: machiResult.count ?? 0,
    maps: mapsResult.count ?? 0,
    pendingReports,
  };
}

export async function HomePage() {
  const stats = await getStats();

  const statItems = [
    { name: "総ユーザー数", value: stats.users.toLocaleString(), icon: Users },
    { name: "総スポット数", value: stats.spots.toLocaleString(), icon: MapPin },
    { name: "総街数", value: stats.machi.toLocaleString(), icon: Building2 },
    { name: "総マップ数", value: stats.maps.toLocaleString(), icon: Map },
    { name: "未対応の報告", value: stats.pendingReports.toLocaleString(), icon: Flag },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    {stat.name}
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
