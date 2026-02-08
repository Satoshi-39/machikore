-- 予約語リストに 'guide' を追加
-- 使い方ガイドページのパス（/guide）とユーザー名の競合を防止

CREATE OR REPLACE FUNCTION public.check_reserved_username()
RETURNS TRIGGER AS $$
DECLARE
  reserved_names TEXT[] := ARRAY[
    -- アプリ内ルート
    'about', 'admin', 'api', 'app', 'auth', 'blog', 'contact',
    'dashboard', 'docs', 'explore', 'faq', 'feed', 'guide', 'help', 'home',
    'login', 'logout', 'maps', 'notifications', 'privacy', 'register',
    'search', 'settings', 'signup', 'spots', 'support', 'terms', 'tokushoho', 'users',
    -- システム・技術系
    '_next', 'favicon.ico', 'robots.txt', 'sitemap.xml', '.well-known',
    'static', 'public', 'assets', 'images',
    -- ブランド・一般的な予約語
    'machikore', 'official', 'system', 'null', 'undefined',
    'anonymous', 'root', 'www'
  ];
BEGIN
  IF LOWER(NEW.username) = ANY(reserved_names) THEN
    RAISE EXCEPTION 'このユーザー名は予約されています: %', NEW.username
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
