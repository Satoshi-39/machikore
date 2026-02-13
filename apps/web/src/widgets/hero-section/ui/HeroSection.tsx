import { APP_STORE_URL } from '@/shared/config';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="overflow-hidden max-h-[600px] sm:max-h-[820px] lg:max-h-[690px]">
      <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-16 py-18 sm:py-12 lg:py-6">
        {/* Left: Text Content */}
        <div className="flex-1 min-w-0 text-center lg:text-left lg:-mt-12 lg:pl-8">
          <h1 className="text-2xl sm:text-4xl lg:text-[2.5rem] xl:text-5xl font-bold tracking-tight whitespace-nowrap">
            街をコレクションしよう
          </h1>
          <p className="mt-3 sm:mt-5 text-base sm:text-xl text-muted-foreground">
            街のスポットをマップにまとめて共有。
            <br />
            誰かの「地図」が次の冒険のきっかけに。
          </p>
          <div className="mt-6 sm:mt-10">
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
              <Image
                src="/images/badge-app-store.svg"
                alt="App Storeからダウンロード"
                width={200}
                height={67}
                className="inline-block w-[160px] sm:w-[200px] h-auto hover:opacity-80 transition-opacity"
                priority
              />
            </a>
          </div>
        </div>

        {/* Right/Bottom: Mockup Image */}
        <div className="flex-1 min-w-0 flex justify-center mt-2 sm:mt-4 lg:mt-12">
          <Image
            src="/images/homepage_image.png"
            alt="街コレ アプリ画面"
            width={601}
            height={1306}
            className="w-[240px] sm:w-[320px] lg:w-[380px] h-auto drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </section>
  );
}
