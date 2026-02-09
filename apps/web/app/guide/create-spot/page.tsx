import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'スポットを登録する - 使い方ガイド - 街コレ',
  description:
    '街コレでスポットを登録する方法をステップごとに解説します。検索・現在地・地図ピンの3つの登録方法を紹介します。',
};

const IMG = '/images/guide/create_spot';

interface GuideStepProps {
  step: number;
  title: string;
  description: string;
  images: { src: string; alt: string }[];
  note?: string;
}

function GuideStep({ step, title, description, images, note }: GuideStepProps) {
  return (
    <div className="mb-12 last:mb-0">
      <h2 className="font-bold text-lg text-[var(--on-surface)] mb-3">
        {step}. {title}
      </h2>
      <p className="text-[var(--on-surface-variant)] leading-relaxed mb-4">
        {description}
      </p>
      {note && <p className="text-sm text-red-500 mb-4">{note}</p>}
      <div className="flex flex-col items-center gap-4">
        {images.map((img) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className="rounded-xl shadow-sm max-w-[320px] w-full"
          />
        ))}
      </div>
    </div>
  );
}

interface BranchMethodProps {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  images: { src: string; alt: string }[];
}

function BranchMethod({
  icon,
  label,
  title,
  description,
  images,
}: BranchMethodProps) {
  return (
    <div className="border border-[var(--outline-variant)] rounded-lg p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-[var(--primary)] bg-[var(--primary-container)] px-2 py-0.5 rounded">
          {label}
        </span>
        <span className="text-[var(--on-surface-variant)]">{icon}</span>
        <h3 className="font-bold text-[var(--on-surface)]">{title}</h3>
      </div>
      <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed mb-4">
        {description}
      </p>
      <div className="flex flex-col items-center gap-4">
        {images.map((img) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className="rounded-xl shadow-sm max-w-[280px] w-full"
          />
        ))}
      </div>
    </div>
  );
}

export default function CreateSpotGuidePage() {
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
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[var(--on-surface)]">
              スポットを登録する
            </h1>
          </div>
          <p className="text-[var(--on-surface-variant)] mt-3">
            マップにスポットを追加して、場所の情報や写真を記録しましょう
          </p>
        </div>

        {/* ステップ解説 */}
        <div className="bg-[var(--surface)] rounded-xl shadow-sm p-6 sm:p-8">
          {/* Step 1 */}
          <GuideStep
            step={1}
            title="＋ボタンをタップ"
            description="画面下部の「＋」ボタンをタップすると、作成メニューが表示されます。"
            images={[
              {
                src: `${IMG}/create_spot_01.png`,
                alt: '画面下部の＋ボタン',
              },
            ]}
          />

          {/* Step 2 */}
          <GuideStep
            step={2}
            title="「スポット」を選択"
            description="作成メニューから「スポット」を選択します。"
            images={[
              {
                src: `${IMG}/create_spot_02.png`,
                alt: '作成メニュー（マップ・スポット・コレクション）',
              },
            ]}
          />

          {/* Step 3 */}
          <GuideStep
            step={3}
            title="「マップを選択」をタップ"
            description="スポットを追加するマップを選びます。「マップを選択」をタップすると、作成済みのマップ一覧が表示されます。"
            images={[
              {
                src: `${IMG}/create_spot_03.png`,
                alt: 'スポットを追加モーダル（マップ選択）',
              },
            ]}
          />

          {/* Step 4 */}
          <GuideStep
            step={4}
            title="追加先マップを選ぶ"
            description="マップ一覧から追加先を選びます。新しいマップを作りたい場合は「新規マップを作成」も選べます。"
            images={[
              {
                src: `${IMG}/create_spot_04.png`,
                alt: 'マップ選択ドロップダウン（既存マップ一覧）',
              },
            ]}
          />

          {/* Step 5: 分岐ステップ */}
          <div className="mb-12">
            <h2 className="font-bold text-lg text-[var(--on-surface)] mb-3">
              5. 場所を選ぶ
            </h2>
            <p className="text-[var(--on-surface-variant)] leading-relaxed mb-6">
              スポットの場所を登録する方法は3つあります。お好みの方法を選んでください。
            </p>

            <div className="flex flex-col gap-4">
              {/* 方法A: 検索して登録 */}
              <BranchMethod
                label="方法A"
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                }
                title="検索して登録"
                description="「検索して登録」をタップして、場所名や住所で検索します。検索結果の候補一覧から登録したい場所を選びます。"
                images={[
                  {
                    src: `${IMG}/create_spot_05_A.png`,
                    alt: '「検索して登録」を選択',
                  },
                  {
                    src: `${IMG}/create_spot_06_A.png`,
                    alt: '場所名で検索して候補から選択',
                  },
                ]}
              />

              {/* 方法B: 現在地から登録 */}
              <BranchMethod
                label="方法B"
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                }
                title="現在地から登録"
                description="「現在地から登録」をタップすると、今いる場所の住所が自動取得されます。スポット名は自分で入力します。"
                images={[
                  {
                    src: `${IMG}/create_spot_05_B.png`,
                    alt: '「現在地から登録」を選択',
                  },
                  {
                    src: `${IMG}/create_spot_06_B.png`,
                    alt: '現在地の住所が自動入力されたスポット登録フォーム',
                  },
                ]}
              />

              {/* 方法C: 地図上でピンを刺して登録 */}
              <BranchMethod
                label="方法C"
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="17" x2="12" y2="22" />
                    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                  </svg>
                }
                title="地図上でピンを刺して登録"
                description="「地図上でピンを刺して登録」をタップすると地図が表示されます。ドラッグしてピンの位置を調整し、「この位置で登録」をタップします。スポット名は自分で入力します。"
                images={[
                  {
                    src: `${IMG}/create_spot_05_C.png`,
                    alt: '「地図上でピンを刺して登録」を選択',
                  },
                  {
                    src: `${IMG}/create_spot_06_C.png`,
                    alt: '地図上でピン位置を調整',
                  },
                ]}
              />
            </div>
          </div>

          {/* Step 6 */}
          <GuideStep
            step={6}
            title="スポット情報を入力する"
            description="どの方法でもスポット登録フォームに進みます。「このスポットを一言で」（必須）と写真を入力します。"
            note="※ 検索して登録した場合はスポット名が自動入力されますが、その他の方法ではスポット名も入力が必要です。"
            images={[
              {
                src: `${IMG}/create_spot_07_A.png`,
                alt: 'スポット登録フォーム（スポット名・一言・写真）',
              },
            ]}
          />

          {/* Step 7 */}
          <GuideStep
            step={7}
            title="タグ・色を設定してスポットを登録する"
            description="タグ、スポットの色、公開設定を確認し、「スポットを登録」をタップします。"
            note="※ スポットを公開するには記事の執筆が必要です。作成直後は非公開になります。"
            images={[
              {
                src: `${IMG}/create_spot_08.png`,
                alt: 'スポット登録フォーム（タグ・色・公開設定・登録ボタン）',
              },
            ]}
          />

          {/* Step 8 */}
          <GuideStep
            step={8}
            title="すぐに記事を書くか選ぶ"
            description="登録後に「記事を書きますか？」と表示されます。「書く」を選ぶと記事編集ページが開きます。「あとで」を選んだ場合は、スポット編集画面からいつでも記事を追加できます。"
            images={[
              {
                src: `${IMG}/create_spot_09.png`,
                alt: '「記事を書きますか？」ダイアログ',
              },
            ]}
          />

          {/* Step 9 */}
          <GuideStep
            step={9}
            title="記事編集ページを開く"
            description="「書く」を選択した場合、記事編集ページが開きます。スポット登録時に設定した写真がカバー画像として自動表示されます。また「このスポットを一言で」で入力した内容が記事のタイトルとして表示されます（ここで編集も可能です）。"
            images={[
              {
                src: `${IMG}/create_spot_10.png`,
                alt: '記事エディター（タイトル）',
              },
            ]}
          />

          {/* Step 10 */}
          <GuideStep
            step={10}
            title="本文を書いて保存する"
            description="記事の本文を自由に書きましょう。書き終えたら右上の「保存」をタップします。"
            images={[
              {
                src: `${IMG}/create_spot_11.png`,
                alt: '記事エディター（本文執筆・保存ボタン）',
              },
            ]}
          />

          {/* Step 11 */}
          <GuideStep
            step={11}
            title="公開設定をONにする"
            description="記事を保存したら、スポット編集画面に戻り、「公開設定」をONにできます。"
            images={[
              {
                src: `${IMG}/create_spot_12.png`,
                alt: 'スポット編集画面の公開設定（非公開状態）',
              },
            ]}
          />

          {/* Step 12 */}
          <GuideStep
            step={12}
            title="マップの同時公開を確認する"
            description="マップ内で最初のスポットを公開する場合、マップも同時に公開されます。確認して「OK」をタップします。"
            images={[
              {
                src: `${IMG}/create_spot_13.png`,
                alt: '「マップも同時に公開されます」アラート',
              },
            ]}
          />

          {/* Step 13 */}
          <GuideStep
            step={13}
            title="変更を保存して公開完了"
            description="公開設定がONになっていることを確認して「変更を保存」をタップすれば、スポットの公開は完了です。"
            images={[
              {
                src: `${IMG}/create_spot_14.png`,
                alt: '公開設定ON・変更を保存ボタン',
              },
            ]}
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
            href="/guide/create-map"
            className="text-sm text-[var(--on-surface-variant)] hover:underline"
          >
            前のガイド: マップを作る &larr;
          </Link>
        </div>
      </div>
    </main>
  );
}
