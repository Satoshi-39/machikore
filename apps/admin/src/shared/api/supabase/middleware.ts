import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { type AdminRoleType } from "@/shared/config";

export type AdminUser = {
  userId: string;
  role: AdminRoleType;
};

/**
 * ミドルウェア用のSupabaseクライアント
 * リクエスト/レスポンス間でCookieを適切に処理する
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // セッションを更新し、期限切れのAuthトークンをリフレッシュ
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, adminUser: null, supabaseResponse };
  }

  // 管理者かどうかをチェック
  const { data: adminData, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id, role")
    .eq("user_id", user.id)
    .single();

  console.log("Logged in user:", user.id, user.email);
  console.log("Admin data:", adminData);
  console.log("Admin error:", adminError);

  const adminUser: AdminUser | null = adminData
    ? { userId: adminData.user_id, role: adminData.role as AdminRoleType }
    : null;

  return { user, adminUser, supabaseResponse };
}
