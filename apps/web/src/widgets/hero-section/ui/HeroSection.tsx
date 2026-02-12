import { APP_STORE_URL } from '@/shared/config';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden max-h-[660px] md:max-h-[550px]">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-12 py-10 md:py-4">
        {/* Left: Text Content */}
        <div className="flex-1 text-center md:text-left md:-mt-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight whitespace-nowrap">
            街をコレクションしよう
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl">
            街のスポットをマップにまとめて共有。
            <br />
            誰かの「地図」が次の冒険のきっかけに。
          </p>
          <div className="mt-8">
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
              <Image
                src="/images/badge-app-store.svg"
                alt="App Storeからダウンロード"
                width={160}
                height={54}
                className="inline-block hover:opacity-80 transition-opacity"
                priority
              />
            </a>
          </div>
        </div>

        {/* Right/Bottom: Mockup Image */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-[240px] md:w-[300px] mt-4 md:mt-12">
            <Image
              src="/images/homepage_image.png"
              alt="街コレ アプリ画面"
              width={601}
              height={1306}
              className="w-full h-auto drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
