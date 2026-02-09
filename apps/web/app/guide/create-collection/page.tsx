import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'コレクションを作る - 使い方ガイド - 街コレ',
  description:
    '街コレでコレクションを作成し、お気に入りのマップをまとめる方法をステップごとに解説します。',
};

const IMG = '/images/guide/create_collection';

interface GuideStepProps {
  step: number;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  note?: string;
  noteColor?: 'red' | 'default';
}

function GuideStep({
  step,
  title,
  description,
  imageSrc,
  imageAlt,
  note,
  noteColor = 'red',
}: GuideStepProps) {
  return (
    <div className="mb-12 last:mb-0">
      <h2 className="font-bold text-lg text-[var(--on-surface)] mb-3">
        {step}. {title}
      </h2>
      <p className="text-[var(--on-surface-variant)] leading-relaxed mb-4">
        {description}
      </p>
      {note && (
        <p className={`text-sm mb-4 ${noteColor === 'red' ? 'text-red-500' : 'text-[var(--on-surface-variant)]'}`}>
          {note}
        </p>
      )}
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

export default function CreateCollectionGuidePage() {
  return (
    <main className="min-h-screen bg-[var(--surface-variant)]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link
            href="/guide"
            className="text-sm text-[var(--primary)] hover:underline"
          >
            &larr; 使い方ガイドに戻る
          </Link>
        </div>

        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[var(--on-surface)]">
              コレクションを作る
            </h1>
          </div>
          <p className="text-[var(--on-surface-variant)] mt-3">
            お気に入りのマップをまとめて、テーマごとに整理しましょう
          </p>
        </div>

        {/* ステップ解説 */}
        <div className="bg-[var(--surface)] rounded-xl shadow-sm p-6 sm:p-8">
          <GuideStep
            step={1}
            title="＋ボタンをタップ"
            description="画面下部の「＋」ボタンをタップすると、作成メニューが表示されます。"
            imageSrc={`${IMG}/create_collection_01.png`}
            imageAlt="画面下部の＋ボタン"
          />

          <GuideStep
            step={2}
            title="「コレクション」を選択"
            description="作成メニューから「コレクション」を選択します。"
            imageSrc={`${IMG}/create_collection_02.png`}
            imageAlt="作成メニュー（マップ・スポット・コレクション）"
          />

          <GuideStep
            step={3}
            title="コレクション情報を入力して作成する"
            description="コレクション名（必須）、説明、サムネイル画像を設定します。公開設定をONにすると他のユーザーからも閲覧できます。すべて入力したら「作成」をタップします。"
            imageSrc={`${IMG}/create_collection_03.png`}
            imageAlt="コレクション作成フォーム（コレクション名・説明・サムネイル・公開設定・作成ボタン）"
          />

          <GuideStep
            step={4}
            title="マイページのコレクションタブを開く"
            description="作成したコレクションはマイページのコレクションタブから確認できます。"
            imageSrc={`${IMG}/create_collection_04.png`}
            imageAlt="マイページのコレクションタブ"
          />

          <GuideStep
            step={5}
            title="コレクション一覧からメニューを開く"
            description="コレクション一覧が表示されます。マップを追加するには、コレクションの右側にある「⋯」ボタンをタップします。"
            note="※ 右上の「＋」ボタンからもコレクションを新規作成できます。"
            noteColor="default"
            imageSrc={`${IMG}/create_collection_05.png`}
            imageAlt="コレクション一覧（⋯メニューボタン）"
          />

          <GuideStep
            step={6}
            title="「編集」を選択する"
            description="メニューから「編集」を選択します。"
            imageSrc={`${IMG}/create_collection_06.png`}
            imageAlt="編集・削除メニュー"
          />

          <GuideStep
            step={7}
            title="「マップを管理」をタップする"
            description="コレクション編集画面の「マップを管理」をタップすると、マップの追加画面に進みます。"
            imageSrc={`${IMG}/create_collection_07.png`}
            imageAlt="コレクション編集画面（マップを管理）"
          />

          <GuideStep
            step={8}
            title="コレクションに追加するマップを選ぶ"
            description="自分のマップ一覧が表示されます。コレクションに追加したいマップの「追加」ボタンをタップします。"
            imageSrc={`${IMG}/create_collection_08.png`}
            imageAlt="マップを管理画面（追加ボタン）"
          />

          <GuideStep
            step={9}
            title="マップの追加を確認する"
            description="追加したマップは「追加済」と表示されます。複数のマップを追加できます。"
            imageSrc={`${IMG}/create_collection_09.png`}
            imageAlt="マップを管理画面（追加済み状態）"
          />

          <GuideStep
            step={10}
            title="コレクションの完成"
            description="編集を終了し、再度コレクションを開くとマップが追加された状態を確認できます。テーマごとにマップをまとめることができました。"
            imageSrc={`${IMG}/create_collection_10.png`}
            imageAlt="コレクション詳細画面（マップが追加された状態）"
          />
        </div>

        {/* フッターナビ */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            href="/guide"
            className="text-sm text-[var(--primary)] hover:underline"
          >
            &larr; ガイド一覧
          </Link>
          <Link
            href="/guide/create-spot"
            className="text-sm text-[var(--on-surface-variant)] hover:underline"
          >
            前のガイド: スポットを登録する &larr;
          </Link>
        </div>
      </div>
    </main>
  );
}
