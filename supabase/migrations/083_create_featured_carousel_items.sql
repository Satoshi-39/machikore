-- 特集カルーセルアイテムテーブル
-- 発見タブの特集カルーセルに表示するバナー・キュレーションコンテンツ

create table public.featured_carousel_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,                      -- 表示タイトル（例: "ラーメンマップ大集合"）
  description text,                         -- サブタイトル・説明（任意）
  image_url text not null,                  -- バナー画像URL
  link_type text not null default 'tag',    -- リンク種別: 'tag' | 'map' | 'url'
  link_value text,                          -- リンク先の値（タグ名/マップID/URL）
  related_tags text[],                      -- 関連タグ一覧（特集ページで表示するタグカテゴリ）
  display_order int not null default 0,     -- 表示順（小さい順）
  is_active boolean not null default true,  -- 公開/非公開フラグ
  starts_at timestamptz,                    -- 表示開始日時（null=即時公開）
  ends_at timestamptz,                      -- 表示終了日時（null=無期限）
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- インデックス
create index idx_featured_carousel_items_active_order on public.featured_carousel_items (is_active, display_order)
  where is_active = true;

-- updated_at自動更新トリガー
create trigger update_featured_carousel_items_updated_at
  before update on public.featured_carousel_items
  for each row
  execute function update_updated_at_column();

-- RLS有効化
alter table public.featured_carousel_items enable row level security;

-- RLSポリシー: 全ユーザー（認証済み・匿名）が有効なアイテムを閲覧可能
create policy "featured_carousel_items_select_policy"
  on public.featured_carousel_items
  for select
  to authenticated, anon
  using (
    is_active = true
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at > now())
  );

-- コメント
comment on table public.featured_carousel_items is '発見タブの特集カルーセルに表示するバナーコンテンツ';
comment on column public.featured_carousel_items.title is '表示タイトル';
comment on column public.featured_carousel_items.description is 'サブタイトル・説明';
comment on column public.featured_carousel_items.image_url is 'バナー画像URL';
comment on column public.featured_carousel_items.link_type is 'リンク種別（tag/map/user/url）';
comment on column public.featured_carousel_items.link_value is 'リンク先の値';
comment on column public.featured_carousel_items.related_tags is '関連タグ一覧';
comment on column public.featured_carousel_items.display_order is '表示順（小さい順）';
comment on column public.featured_carousel_items.is_active is '公開フラグ';
comment on column public.featured_carousel_items.starts_at is '表示開始日時';
comment on column public.featured_carousel_items.ends_at is '表示終了日時';
