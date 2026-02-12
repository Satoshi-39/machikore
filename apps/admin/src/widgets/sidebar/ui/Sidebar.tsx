"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Map,
  Settings,
  Building2,
  Upload,
  Flag,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const navigation = [
  { name: "ダッシュボード", href: "/", icon: LayoutDashboard },
  { name: "ユーザー管理", href: "/users", icon: Users },
  { name: "報告管理", href: "/reports", icon: Flag },
  { name: "スポット管理", href: "/spots", icon: MapPin },
  { name: "街管理", href: "/machi", icon: Building2 },
  { name: "マップ管理", href: "/maps", icon: Map },
  { name: "登録", href: "/register", icon: Upload },
  { name: "設定", href: "/settings", icon: Settings },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-52 flex-col">
      <div className="flex grow flex-col overflow-y-auto border-r border-gray-200 bg-white px-4 pb-4 pt-4">
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                          isActive
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive
                              ? "text-gray-900"
                              : "text-gray-400 group-hover:text-gray-900",
                            "h-5 w-5 shrink-0"
                          )}
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
