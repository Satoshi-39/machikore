-- 予約語ユーザー名をデータベースレベルでブロックするトリガー
-- クライアント側バリデーションの最終防衛線として永続的に使用

CREATE OR REPLACE FUNCTION public.check_reserved_username()
RETURNS TRIGGER AS $$
DECLARE
  reserved_names TEXT[] := ARRAY[
    -- アプリ内ルート
    'about', 'admin', 'api', 'app', 'auth', 'blog', 'contact',
    'dashboard', 'docs', 'explore', 'faq', 'feed', 'help', 'home',
    'login', 'logout', 'maps', 'notifications', 'privacy', 'register',
    'search', 'settings', 'signup', 'spots', 'support', 'terms', 'users',
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

CREATE TRIGGER trigger_check_reserved_username
  BEFORE INSERT OR UPDATE OF username ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_reserved_username();
