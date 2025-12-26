/**
 * OGP (Open Graph Protocol) 生成 Edge Function
 *
 * マップやスポットの共有リンク用にOGPメタタグ付きHTMLを返す
 * また、Universal Links / App Links用の設定ファイルも提供
 *
 * エンドポイント:
 * - /maps/{id} - マップのOGPページ
 * - /spots/{id} - スポットのOGPページ
 * - /.well-known/apple-app-site-association - iOS Universal Links設定
 * - /.well-known/assetlinks.json - Android App Links設定
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// 環境変数
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const APP_DOMAIN = Deno.env.get("APP_DOMAIN") || "machikore.app";
const IOS_BUNDLE_ID = "com.tyatsushi.machikore";
const IOS_TEAM_ID = "9KT9GSG58F";
const ANDROID_PACKAGE = "com.tyatsushi.machikore";
// Android App Linksの署名フィンガープリント（SHA256）
// TODO: 本番用の署名証明書のフィンガープリントを設定
const ANDROID_SHA256_FINGERPRINTS = Deno.env.get("ANDROID_SHA256_FINGERPRINTS")?.split(",") || [];

// App Store / Play Store URL
const APP_STORE_URL = "https://apps.apple.com/app/id123456789"; // TODO: 実際のApp Store IDに変更
const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

// Supabaseクライアント
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// CORSヘッダー
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * マップ情報を取得
 */
async function getMap(mapId: string) {
  const { data, error } = await supabase
    .from("maps")
    .select(`
      id,
      name,
      description,
      thumbnail_url,
      user_id,
      users!inner(display_name, avatar_url)
    `)
    .eq("id", mapId)
    .eq("is_public", true)
    .single();

  if (error || !data) {
    console.error("[ogp] Map not found:", mapId, error);
    return null;
  }

  return data;
}

/**
 * スポット情報を取得
 */
async function getSpot(spotId: string) {
  const { data, error } = await supabase
    .from("user_spots")
    .select(`
      id,
      map_id,
      master_spot_id,
      master_spots!inner(name, name_en),
      maps!inner(name, is_public, user_id, users!inner(display_name))
    `)
    .eq("id", spotId)
    .single();

  if (error || !data) {
    console.error("[ogp] Spot not found:", spotId, error);
    return null;
  }

  // 非公開マップのスポットは表示しない
  if (!data.maps?.is_public) {
    return null;
  }

  // スポット画像を取得
  const { data: images } = await supabase
    .from("spot_images")
    .select("image_url")
    .eq("spot_id", spotId)
    .order("display_order", { ascending: true })
    .limit(1);

  return {
    ...data,
    image_url: images?.[0]?.image_url || null,
  };
}

/**
 * OGP HTML生成
 */
function generateOgpHtml(options: {
  title: string;
  description: string;
  imageUrl: string | null;
  url: string;
  type: "map" | "spot";
  appDeepLink: string;
}) {
  const { title, description, imageUrl, url, type, appDeepLink } = options;

  // デフォルト画像（サムネイルがない場合）
  const ogImage = imageUrl || `https://${APP_DOMAIN}/images/ogp-default.png`;
  const siteName = "街コレ";

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - ${siteName}</title>

  <!-- OGP Meta Tags -->
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(ogImage)}">
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${siteName}">
  <meta property="og:locale" content="ja_JP">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(ogImage)}">

  <!-- App Links for Deep Linking -->
  <meta property="al:ios:app_store_id" content="123456789">
  <meta property="al:ios:app_name" content="${siteName}">
  <meta property="al:ios:url" content="${escapeHtml(appDeepLink)}">
  <meta property="al:android:package" content="${ANDROID_PACKAGE}">
  <meta property="al:android:app_name" content="${siteName}">
  <meta property="al:android:url" content="${escapeHtml(appDeepLink)}">

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .logo {
      width: 80px;
      height: 80px;
      margin-bottom: 20px;
    }
    h1 {
      color: #333;
      font-size: 24px;
      margin-bottom: 10px;
    }
    p {
      color: #666;
      font-size: 16px;
      margin-bottom: 30px;
      line-height: 1.6;
    }
    .buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .btn {
      display: block;
      padding: 14px 24px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .btn-secondary {
      background: #f5f5f5;
      color: #333;
    }
    .store-buttons {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 20px;
    }
    .store-btn img {
      height: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://${APP_DOMAIN}/images/app-icon.png" alt="街コレ" class="logo">
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>

    <div class="buttons">
      <a href="${escapeHtml(appDeepLink)}" class="btn btn-primary">
        アプリで開く
      </a>
    </div>

    <div class="store-buttons">
      <a href="${APP_STORE_URL}" class="store-btn">
        <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/ja-jp" alt="App Store">
      </a>
      <a href="${PLAY_STORE_URL}" class="store-btn">
        <img src="https://play.google.com/intl/en_us/badges/static/images/badges/ja_badge_web_generic.png" alt="Google Play" style="height: 60px; margin-top: -10px;">
      </a>
    </div>
  </div>

  <script>
    // アプリがインストールされている場合は自動でディープリンクを試行
    setTimeout(function() {
      window.location.href = "${escapeHtml(appDeepLink)}";
    }, 100);
  </script>
</body>
</html>`;
}

/**
 * HTMLエスケープ
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * apple-app-site-association (iOS Universal Links)
 */
function getAppleAppSiteAssociation() {
  return {
    applinks: {
      apps: [],
      details: [
        {
          appID: `${IOS_TEAM_ID}.${IOS_BUNDLE_ID}`,
          paths: ["/maps/*", "/spots/*"],
        },
      ],
    },
    webcredentials: {
      apps: [`${IOS_TEAM_ID}.${IOS_BUNDLE_ID}`],
    },
  };
}

/**
 * assetlinks.json (Android App Links)
 */
function getAssetLinks() {
  return ANDROID_SHA256_FINGERPRINTS.map((fingerprint) => ({
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: ANDROID_PACKAGE,
      sha256_cert_fingerprints: [fingerprint],
    },
  }));
}

/**
 * URLからパスを解析
 */
function parsePath(url: URL): { type: string; id: string } | null {
  const path = url.pathname;

  // /maps/{id}
  const mapsMatch = path.match(/^\/maps\/([a-zA-Z0-9-]+)$/);
  if (mapsMatch) {
    return { type: "maps", id: mapsMatch[1] };
  }

  // /spots/{id}
  const spotsMatch = path.match(/^\/spots\/([a-zA-Z0-9-]+)$/);
  if (spotsMatch) {
    return { type: "spots", id: spotsMatch[1] };
  }

  return null;
}

/**
 * メインハンドラー
 */
Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  console.log("[ogp] Request:", req.method, path);

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // apple-app-site-association
  if (path === "/.well-known/apple-app-site-association" || path === "/apple-app-site-association") {
    return new Response(JSON.stringify(getAppleAppSiteAssociation()), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400",
        ...corsHeaders,
      },
    });
  }

  // assetlinks.json
  if (path === "/.well-known/assetlinks.json") {
    return new Response(JSON.stringify(getAssetLinks()), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400",
        ...corsHeaders,
      },
    });
  }

  // マップ/スポットのOGPページ
  const parsed = parsePath(url);

  if (parsed?.type === "maps") {
    const map = await getMap(parsed.id);

    if (!map) {
      return new Response("Map not found", { status: 404 });
    }

    const html = generateOgpHtml({
      title: map.name || "マップ",
      description: map.description || `${map.users?.display_name || "ユーザー"}のマップ`,
      imageUrl: map.thumbnail_url,
      url: `https://${APP_DOMAIN}/maps/${parsed.id}`,
      type: "map",
      appDeepLink: `machikore://maps/${parsed.id}`,
    });

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
        ...corsHeaders,
      },
    });
  }

  if (parsed?.type === "spots") {
    const spot = await getSpot(parsed.id);

    if (!spot) {
      return new Response("Spot not found", { status: 404 });
    }

    const spotName = spot.master_spots?.name || spot.master_spots?.name_en || "スポット";
    const mapName = spot.maps?.name || "マップ";
    const authorName = spot.maps?.users?.display_name || "ユーザー";

    const html = generateOgpHtml({
      title: spotName,
      description: `${authorName}の「${mapName}」に掲載`,
      imageUrl: spot.image_url,
      url: `https://${APP_DOMAIN}/spots/${parsed.id}`,
      type: "spot",
      appDeepLink: `machikore://spots/${parsed.id}`,
    });

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
        ...corsHeaders,
      },
    });
  }

  // ルートパス - アプリ紹介ページ
  if (path === "/" || path === "") {
    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>街コレ - あなただけのマップを作ろう</title>
  <meta property="og:title" content="街コレ">
  <meta property="og:description" content="お気に入りの場所を集めて、あなただけのマップを作ろう">
  <meta property="og:image" content="https://${APP_DOMAIN}/images/ogp-default.png">
  <meta property="og:url" content="https://${APP_DOMAIN}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
</head>
<body>
  <script>
    // ストアにリダイレクト
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1) {
      window.location.href = "${APP_STORE_URL}";
    } else if (ua.indexOf('android') > -1) {
      window.location.href = "${PLAY_STORE_URL}";
    } else {
      window.location.href = "${APP_STORE_URL}";
    }
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        ...corsHeaders,
      },
    });
  }

  // 404
  return new Response("Not found", { status: 404 });
});
