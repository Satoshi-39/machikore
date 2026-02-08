import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'マップを作る - 使い方ガイド - 街コレ',
  description:
    '街コレでオリジナルのマップを作成する方法をステップごとに解説します。',
};

interface GuideStepProps {
  step: number;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  note?: string;
}

function GuideStep({
  step,
  title,
  description,
  imageSrc,
  imageAlt,
  note,
}: GuideStepProps) {
  return (
    <div className="mb-12 last:mb-0">
      {/* ステップ番号 + タイトル */}
      <h2 className="font-bold text-lg text-[var(--on-surface)] mb-3">
        {step}. {title}
      </h2>
      {/* 説明 */}
      <p className="text-[var(--on-surface-variant)] leading-relaxed mb-4">
        {description}
      </p>
      {note && <p className="text-sm text-red-500 mb-4">※ {note}</p>}
      {/* スクリーンショット */}
      <div className="flex justify-center">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="rounded-xl shadow-sm max-w-[320px] w-full"
        />
      </div>
    </div>
  );
}

export default function CreateMapGuidePage() {
  return (
    <main className="min-h-screen bg-[var(--surface-variant)]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link
            href="/guide"
            className="text-sm text-[var(--primary)] hover:underline"
          >
            ← 使い方ガイドに戻る
          </Link>
        </div>

        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[var(--on-surface)]">
              マップを作る
            </h1>
          </div>
          <p className="text-[var(--on-surface-variant)] mt-3">
            オリジナルのマップを作成して、お気に入りの場所をまとめましょう
          </p>
        </div>

        {/* ステップ解説 */}
        <div className="bg-[var(--surface)] rounded-xl shadow-sm p-6 sm:p-8">
          <GuideStep
            step={1}
            title="＋ボタンをタップ"
            description="画面下部の「＋」ボタンをタップすると、作成メニューが表示されます。どのタブからでもアクセスできます。"
            imageSrc="/images/guide/create_map/create_map_01.png"
            imageAlt="画面下部の＋ボタン"
          />

          <GuideStep
            step={2}
            title="「マップ」を選択"
            description="作成メニューから「マップ」を選択しましょう。"
            imageSrc="/images/guide/create_map/create_map_02.png"
            imageAlt="作成メニュー（マップ・スポット・コレクション）"
          />

          <GuideStep
            step={3}
            title="マップ情報を入力する"
            description="マップ名、説明、カテゴリーを入力します。マップ名と説明、カテゴリーは必須項目です。"
            imageSrc="/images/guide/create_map/create_map_03.png"
            imageAlt="マップ作成フォーム（マップ名・説明・カテゴリー）"
          />

          <GuideStep
            step={4}
            title="サムネイルとタグを設定して作成"
            description="サムネイル画像やタグを設定して、マップの見つけやすさをアップしましょう。すべて入力したら「マップを作成」ボタンをタップして完了です。"
            note="マップを公開するには1つ以上のスポットを公開する必要があるため、作成直後は非公開になります。"
            imageSrc="/images/guide/create_map/create_map_04.png"
            imageAlt="マップ作成フォーム（サムネイル・タグ・非公開設定・作成ボタン）"
          />
        </div>

        {/* フッターナビ */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            href="/guide"
            className="text-sm text-[var(--primary)] hover:underline"
          >
            ← ガイド一覧
          </Link>
          <Link
            href="/guide"
            className="text-sm text-[var(--on-surface-variant)] hover:underline"
          >
            次のガイド: スポットを登録する →
          </Link>
        </div>
      </div>
    </main>
  );
}
