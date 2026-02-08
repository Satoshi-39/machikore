/**
 * 予約語リスト
 *
 * /{username} ルーティングと競合するため、
 * ユーザー名として使用できないパス名を管理する。
 *
 * ユーザー登録時のバリデーションでもこのリストを参照すること。
 */
export const RESERVED_USERNAMES = new Set([
  // ===== アプリ内ルート =====
  "about",
  "admin",
  "api",
  "app",
  "auth",
  "blog",
  "contact",
  "dashboard",
  "docs",
  "explore",
  "faq",
  "feed",
  "help",
  "home",
  "login",
  "logout",
  "maps",
  "notifications",
  "privacy",
  "register",
  "search",
  "settings",
  "signup",
  "spots",
  "support",
  "terms",
  "tokushoho",
  "users",

  // ===== システム・技術系 =====
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  ".well-known",
  "static",
  "public",
  "assets",
  "images",

  // ===== ブランド・一般的な予約語 =====
  "machikore",
  "official",
  "system",
  "null",
  "undefined",
  "anonymous",
  "root",
  "www",
]);

/**
 * 指定した文字列が予約語かどうかを判定
 */
export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.has(username.toLowerCase());
}
