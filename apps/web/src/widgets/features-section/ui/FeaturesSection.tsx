export function FeaturesSection() {
  return (
    <section className="pt-36 pb-28 md:pt-52 md:pb-36">
      <h2 className="text-2xl md:text-3xl font-bold text-center">
        街コレについて
      </h2>

      {/* 見出しキャッチコピー */}
      <p className="mt-4 md:mt-6 text-lg md:text-2xl font-medium text-center leading-relaxed">
        同じ場所でも人によって感じ方が違う、
        <br />
        それを表現できるアプリです。
      </p>

      {/* コンセプト説明 */}
      <div className="max-w-2xl mx-auto mt-10 md:mt-14 px-6 md:px-0 flex flex-col items-center gap-4 md:gap-5">
        <p className="text-sm md:text-base text-muted-foreground text-center">
          街コレは、ユーザー投稿記事と地図が一体化した
          <span className="block mt-2 sm:inline sm:mt-0">新しいSNSです。</span>
        </p>
        <p className="text-sm md:text-base text-muted-foreground text-center">
          ❤️スポットをあなた独自の視点で組み合わせて、
          <span className="block mt-2 sm:inline sm:mt-0">
            自分だけのマップが作れます。
          </span>
        </p>
        <p className="text-sm md:text-base text-muted-foreground text-center">
          他ユーザーの投稿を保存し、後で見返すこともできます。
        </p>
        <p className="text-sm md:text-base text-muted-foreground text-center">
          旅行・学習など、使い方はあなた次第です。
        </p>
      </div>
    </section>
  );
}
