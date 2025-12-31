import { Users, MapPin, Building2, Map } from "lucide-react";

const stats = [
  { name: "総ユーザー数", value: "1,234", icon: Users },
  { name: "総スポット数", value: "5,678", icon: MapPin },
  { name: "総街数", value: "123", icon: Building2 },
  { name: "総マップ数", value: "456", icon: Map },
];

export function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
