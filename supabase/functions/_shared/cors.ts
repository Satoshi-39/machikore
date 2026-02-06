/**
 * 共通CORSヘッダーユーティリティ
 *
 * 許可されたオリジンのみCORSを許可する
 */

const ALLOWED_ORIGINS = [
  "https://machikore.io",
  "https://admin.machikore.io",
];

export function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin");
  return {
    "Access-Control-Allow-Origin":
      origin && ALLOWED_ORIGINS.includes(origin)
        ? origin
        : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };
}
