import Link from "next/link";
import { MapPin, Map, Building2 } from "lucide-react";

const registerTypes = [
  {
    name: "スポット登録",
    description: "Google Placesから検索して登録、またはCSVで一括登録",
    href: "/register/spots",
    icon: MapPin,
    color: "bg-blue-500",
  },
  {
    name: "マップ登録",
    description: "公式マップを個別登録、またはCSVで一括登録",
    href: "/register/maps",
    icon: Map,
    color: "bg-green-500",
  },
  {
    name: "街登録",
    description: "街データを個別登録、またはCSVで一括登録",
    href: "/register/machi",
    icon: Building2,
    color: "bg-purple-500",
  },
];

export function RegisterPage() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">登録</h1>
        <p className="mt-2 text-gray-600">
          スポット、マップ、街を個別または一括で登録できます
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {registerTypes.map((type) => (
          <Link
            key={type.name}
            href={type.href}
            className="group relative rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${type.color}`}
            >
              <type.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
              {type.name}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{type.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
