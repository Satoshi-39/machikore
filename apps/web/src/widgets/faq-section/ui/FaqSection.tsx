const faqItems = [
  {
    question: '街コレは無料で使えますか？',
    answer:
      'はい、基本機能は無料でお使いいただけます。マップ・スポットの作成・閲覧など、主要な機能はすべて無料です。より便利に使いたい方向けに、有料プランもご用意しています。',
  },
  {
    question: 'どんなスポットを登録できますか？',
    answer:
      'カフェ、レストラン、公園、観光地、ショップなど、あなたのお気に入りの場所ならなんでも登録できます。既存の地図でまだ名前がない場所でも登録できます。',
  },
  {
    question: 'マップは非公開にもできますか？',
    answer:
      'はい、マップは公開・非公開を選択できます。非公開に設定したマップは自分だけが閲覧でき、他のユーザーには表示されません。',
  },
  {
    question: 'iPhone以外でも使えますか？',
    answer: '現在はiOS版のみ提供しています。Android版は今後対応予定です。',
  },
  {
    question: 'アカウントの作成方法は？',
    answer:
      'Google/Appleアカウント、もしくはメールアドレスをお持ちであれば簡単にアカウントを作成できます。',
  },
];

export function FaqSection() {
  return (
    <section className="py-16 md:py-24">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
        よくある質問
      </h2>
      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        {faqItems.map((item) => (
          <details
            key={item.question}
            className="group border border-border rounded-lg"
          >
            <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-base font-medium select-none list-none">
              <span>{item.question}</span>
              <span className="ml-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
