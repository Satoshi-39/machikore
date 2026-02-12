"use client";

import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/shared/api/supabase/client";
import { Button } from "@/shared/ui/button";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="outline"
      className="w-full"
    >
      別のアカウントでログイン
    </Button>
  );
}
