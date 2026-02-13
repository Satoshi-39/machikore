import Image from 'next/image';

const showcaseItems = [
  {
    src: '/images/screenshot_1.png',
    alt: '街コレ ホーム画面',
    title: 'みんなのマップを探索しよう',
    description:
      'フィードや発見タブでは、他ユーザが投稿したマップを楽しめます。',
  },
  {
    src: '/images/screenshot_2.png',
    alt: '街コレ スポット記事画面',
    title: 'お気に入りのスポットを記事で記録',
    description:
      'お気に入りスポットの写真をアップロードしたり、魅力を記事として表現できます。',
  },
  {
    src: '/images/screenshot_3.png',
    alt: '街コレ マップ画面',
    title: '地図でスポットを巡ろう',
    description:
      'マップ上でスポットの位置を確認できます。Google Mapsとの連携も簡単にできます。',
  },
];

export function ShowcaseSection() {
  return (
    <section className="py-16 md:py-24">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-16">
        街コレの特徴
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8 xl:gap-12">
        {showcaseItems.map((item) => (
          <div key={item.src} className="flex flex-col items-center">
            {/* Circle with clipped screenshot */}
            <div className="w-[380px] h-[380px] lg:w-[280px] lg:h-[280px] xl:w-[380px] xl:h-[380px] rounded-full bg-primary/10 overflow-hidden flex items-start justify-center pt-10 lg:pt-7 xl:pt-10">
              <Image
                src={item.src}
                alt={item.alt}
                width={300}
                height={650}
                className="w-[200px] lg:w-[155px] xl:w-[200px] h-auto drop-shadow-2xl"
              />
            </div>

            {/* Title */}
            <h3 className="mt-8 text-lg md:text-xl font-bold text-center">
              {item.title}
            </h3>

            {/* Description */}
            <p className="mt-2 text-sm text-muted-foreground text-center max-w-[280px]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
