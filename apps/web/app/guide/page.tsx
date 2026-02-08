import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "使い方ガイド - 街コレ",
  description:
    "街コレの使い方ガイドです。マップの閲覧・作成、スポット登録、ブックマークなどの基本機能をご紹介します。",
};

interface GuideSectionProps {
  icon: string;
  title: string;
  description: string;
  imagePlaceholder: string;
}

function GuideSection({
  icon,
  title,
  description,
  imagePlaceholder,
}: GuideSectionProps) {
  return (
    <section className="mb-10">
      {/* スクリーンショットプレースホルダー */}
      <div className="bg-[var(--surface-variant)] rounded-xl h-[220px] flex items-center justify-center mb-4">
        <div className="text-center">
          <span className="text-4xl">{icon}</span>
          <p className="text-sm text-[var(--on-surface-variant)] mt-2">
            {imagePlaceholder}
          </p>
        </div>
      </div>
      <h2 className="font-bold text-xl text-[var(--on-surface)] mb-2">
        {title}
      </h2>
      <p className="text-[var(--on-surface-variant)] leading-relaxed">
        {description}
      </p>
    </section>
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

        {/* ガイドコンテンツ */}
        <div className="bg-[var(--surface)] rounded-xl shadow-sm p-8">
          <GuideSection
            icon="🏠"
            title="マップを見る"
            description="ホームタブでみんなが作ったマップやスポットを閲覧できます。気になるマップをタップして詳細を確認しましょう。フィードにはマップカードとスポットカードが表示され、スワイプで次々とチェックできます。"
            imagePlaceholder="ホームタブのスクリーンショット"
          />

          <GuideSection
            icon="➕"
            title="マップを作る"
            description="画面下部の「＋」ボタンからオリジナルのマップを作成できます。テーマを決めて名前をつけたら、お気に入りの場所をスポットとして登録していきましょう。カフェ巡り、旅行記録、おすすめランチなど、自由なテーマでマップを作れます。"
            imagePlaceholder="マップ作成画面のスクリーンショット"
          />

          <GuideSection
            icon="📍"
            title="スポットを登録する"
            description="マップにスポットを追加して、場所の情報や写真、レビューを記録できます。スポットの登録方法は3つ：場所を検索して登録、現在地から登録、地図上でピンを刺して登録。写真やひとことコメントを添えて、あなただけのスポット情報を作りましょう。"
            imagePlaceholder="スポット登録画面のスクリーンショット"
          />

          <GuideSection
            icon="🔖"
            title="ブックマーク・コレクション"
            description="気になるマップやスポットをブックマークして、後からまとめて確認できます。ブックマークはフォルダで整理でき、コレクション機能を使えば他のユーザーのマップをまとめて自分だけのリストを作ることもできます。"
            imagePlaceholder="ブックマーク画面のスクリーンショット"
          />

          <GuideSection
            icon="🔍"
            title="検索・フィルター"
            description="発見タブでキーワード検索やフィルターを使って、あなたにぴったりのマップやスポットを見つけましょう。カテゴリやエリアで絞り込んだり、人気順で並び替えたりできます。"
            imagePlaceholder="検索画面のスクリーンショット"
          />
        </div>

        {/* アプリダウンロードリンク */}
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
