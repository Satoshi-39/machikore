"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, Bell, LogOut, Settings } from "lucide-react";
import { createBrowserClient } from "@/shared/api/supabase/client";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";

interface HeaderProps {
  onMenuClick?: () => void;
}

type AdminInfo = {
  displayName: string;
  email: string;
  avatarUrl: string | null;
  role: string;
};

function getRoleBadge(role: string) {
  const roleLabels: Record<string, { label: string; className: string }> = {
    owner: { label: "Owner", className: "bg-purple-500" },
    admin: { label: "Admin", className: "bg-blue-500" },
    moderator: { label: "Mod", className: "bg-green-500" },
  };
  const config = roleLabels[role] || { label: role, className: "bg-gray-500" };
  return <Badge className={`${config.className} text-xs`}>{config.label}</Badge>;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      const supabase = createBrowserClient();

      // 現在のセッションを取得
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      // admin_usersテーブルからロールを取得
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", user.id)
        .single();

      // usersテーブルから詳細情報を取得
      const { data: userData } = await supabase
        .from("users")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .single();

      setAdminInfo({
        email: user.email ?? "",
        displayName: userData?.display_name ?? user.email ?? "管理者",
        avatarUrl: userData?.avatar_url ?? null,
        role: adminUser?.role ?? "admin",
      });
    };

    fetchAdminInfo();
  }, []);

  const handleSignOut = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const initials = adminInfo?.displayName
    ?.split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "AD";

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Logo - 中央に常に表示 */}
        <div className="flex flex-1 items-center justify-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/machikore7.png"
              alt="Machikore"
              width={40}
              height={40}
              className="rounded"
            />
          </Link>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {adminInfo?.avatarUrl && (
                    <AvatarImage src={adminInfo.avatarUrl} alt={adminInfo.displayName} />
                  )}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">
                      {adminInfo?.displayName ?? "管理者"}
                    </p>
                    {adminInfo?.role && getRoleBadge(adminInfo.role)}
                  </div>
                  <p className="text-xs leading-none text-muted-foreground">
                    {adminInfo?.email ?? ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  設定
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
