"use client";

import { useRouter } from "next/navigation";
import { ShieldX } from "lucide-react";
import { createBrowserClient } from "@/shared/api/supabase/client";
import { Button } from "@/shared/ui/button";

export function UnauthorizedPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <ShieldX className="h-12 w-12 text-red-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            アクセス権限がありません
          </h1>

          <p className="text-gray-600 mb-6">
            このアカウントには管理画面へのアクセス権限がありません。
            管理者に連絡してください。
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              別のアカウントでログイン
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
