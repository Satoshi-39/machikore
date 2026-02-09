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

/** コレクションアイコン */
function CollectionIcon() {
  return (
    <GuideIcon>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
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
            available
          />
          <GuideCard
            href="/guide/create-collection"
            icon={<CollectionIcon />}
            title="コレクションを作る"
            description="お気に入りのマップをまとめて、テーマごとに整理しましょう。"
            available
          />
        </div>
      </div>
    </main>
  );
}
