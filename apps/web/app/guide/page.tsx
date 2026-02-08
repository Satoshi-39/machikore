import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "使い方ガイド - 街コレ",
  description:
    "街コレの使い方ガイドです。マップの閲覧・作成、スポット登録、ブックマークなどの基本機能をご紹介します。",
};

interface GuideCardProps {
  href: string;
  icon: string;
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
  if (!available) {
    return (
      <div className="bg-[var(--surface)] rounded-xl shadow-sm p-6 opacity-50">
        <span className="text-3xl">{icon}</span>
        <h2 className="font-bold text-lg text-[var(--on-surface)] mt-3 mb-2">
          {title}
        </h2>
        <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">
          {description}
        </p>
        <p className="text-xs text-[var(--on-surface-variant)] mt-3">
          準備中...
        </p>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="block bg-[var(--surface)] rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <span className="text-3xl">{icon}</span>
      <h2 className="font-bold text-lg text-[var(--on-surface)] mt-3 mb-2">
        {title}
      </h2>
      <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">
        {description}
      </p>
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
            icon="🗺️"
            title="マップを作る"
            description="オリジナルのマップを作成して、お気に入りの場所をまとめましょう。"
            available
          />
          <GuideCard
            href="/guide/create-spot"
            icon="📍"
            title="スポットを登録する"
            description="マップにスポットを追加して、場所の情報や写真を記録しましょう。"
          />
          <GuideCard
            href="/guide/browse"
            icon="🏠"
            title="マップを見る"
            description="みんなが作ったマップやスポットを閲覧・発見しましょう。"
          />
          <GuideCard
            href="/guide/bookmark"
            icon="🔖"
            title="ブックマーク・コレクション"
            description="気になるマップやスポットを保存して、あとからまとめて確認しましょう。"
          />
          <GuideCard
            href="/guide/search"
            icon="🔍"
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
