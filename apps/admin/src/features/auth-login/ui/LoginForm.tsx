"use client";

import { useState } from "react";
import { createBrowserClient } from "@/shared/api/supabase/client";
import { Button } from "@/shared/ui/button";

export function LoginForm() {
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
    <div>
      {error && (
        <div className="p-3 bg-error-container border border-error rounded-md mb-4">
          <p className="text-sm text-error">{error}</p>
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
  );
}
