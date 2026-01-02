"use client";

import { useState } from "react";
import { createBrowserClient } from "@/shared/api/supabase/client";
import { Button } from "@/shared/ui/button";

export function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const supabase = createBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
      }
      // OAuth認証はリダイレクトするので、loadingはそのまま
    } catch {
      setError("ログイン中にエラーが発生しました");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              街コレ 管理画面
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              管理者アカウントでログインしてください
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            onClick={handleGoogleLogin}
            className="w-full"
            disabled={loading}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </Button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          管理者権限を持つアカウントのみアクセスできます
        </p>
      </div>
    </div>
  );
}
