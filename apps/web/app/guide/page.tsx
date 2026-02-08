import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '使い方ガイド - 街コレ',
  description:
    '街コレの使い方ガイドです。マップの閲覧・作成、スポット登録、ブックマークなどの基本機能をご紹介します。',
};

/** アプリ内と同じスタイルの青丸アイコン */
function GuideIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center shrink-0">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </div>
  );
}

/** マップアイコン（book/map） */
function MapIcon() {
  return (
    <GuideIcon>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </GuideIcon>
  );
}

/** スポットアイコン（pin） */
function SpotIcon() {
  return (
    <GuideIcon>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </GuideIcon>
  );
}

/** ホームアイコン */
function HomeIcon() {
  return (
    <GuideIcon>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </GuideIcon>
  );
}

/** ブックマークアイコン */
function BookmarkIcon() {
  return (
    <GuideIcon>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </GuideIcon>
  );
}

/** 検索アイコン */
function SearchIcon() {
  return (
    <GuideIcon>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </GuideIcon>
  );
}

interface GuideCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  available?: boolean;
}

function GuideCard({
  href,
  icon,
  title,
  description,
  available = false,
}: GuideCardProps) {
  const content = (
    <>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h2 className="font-bold text-lg text-[var(--on-surface)]">{title}</h2>
      </div>
      <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed pl-[52px]">
        {description}
      </p>
      {!available && (
        <p className="text-xs text-[var(--on-surface-variant)] mt-2 pl-[52px]">
          準備中...
        </p>
      )}
    </>
  );

  if (!available) {
    return (
      <div className="bg-[var(--surface)] rounded-xl shadow-sm p-6 opacity-50">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="block bg-[var(--surface)] rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      {content}
    </Link>
  );
}

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[var(--surface-variant)]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <div className="text-center mb-10">
          <a href="/">
            <img
              src="/images/machikore7.png"
              alt="街コレ"
              className="w-16 h-16 mx-auto mb-4 rounded-2xl"
            />
          </a>
          <h1 className="text-3xl font-bold text-[var(--on-surface)] mb-2">
            使い方ガイド
          </h1>
          <p className="text-[var(--on-surface-variant)]">
            街コレの基本的な使い方をご紹介します
          </p>
        </div>

        {/* ガイド一覧 */}
        <div className="grid gap-4">
          <GuideCard
            href="/guide/create-map"
            icon={<MapIcon />}
            title="マップを作る"
            description="オリジナルのマップを作成して、お気に入りの場所をまとめましょう。"
            available
          />
          <GuideCard
            href="/guide/create-spot"
            icon={<SpotIcon />}
            title="スポットを登録する"
            description="マップにスポットを追加して、場所の情報や写真を記録しましょう。"
          />
          <GuideCard
            href="/guide/browse"
            icon={<HomeIcon />}
            title="マップを見る"
            description="みんなが作ったマップやスポットを閲覧・発見しましょう。"
          />
          <GuideCard
            href="/guide/bookmark"
            icon={<BookmarkIcon />}
            title="ブックマーク・コレクション"
            description="気になるマップやスポットを保存して、あとからまとめて確認しましょう。"
          />
          <GuideCard
            href="/guide/search"
            icon={<SearchIcon />}
            title="検索・フィルター"
            description="キーワードやカテゴリで、ぴったりのマップやスポットを見つけましょう。"
          />
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <p className="text-[var(--on-surface-variant)] mb-4">
            街コレで、あなたの街のお気に入りをコレクションしよう
          </p>
          <a
            href="/"
            className="inline-block bg-[var(--primary)] text-[var(--on-primary)] font-medium px-8 py-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
          >
            街コレを始める
          </a>
        </div>
      </div>
    </main>
  );
}
