import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/shared/api/supabase/middleware";

// 認証不要なパス
const publicPaths = ["/login", "/auth/callback"];

// 未認可（ログイン済みだが管理者ではない）時のパス
const unauthorizedPath = "/unauthorized";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 静的ファイルやAPIルートは除外
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 公開パスはそのまま通す
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 未認可ページはそのまま通す
  if (pathname === unauthorizedPath) {
    return NextResponse.next();
  }

  // セッションを更新してユーザー情報を取得
  const { user, adminUser, supabaseResponse } = await updateSession(request);

  // 未認証の場合はログインページにリダイレクト
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 認証済みだが管理者ではない場合
  if (!adminUser) {
    return NextResponse.redirect(new URL(unauthorizedPath, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * 以下を除くすべてのパスにマッチ:
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化ファイル)
     * - favicon.ico (ファビコン)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
