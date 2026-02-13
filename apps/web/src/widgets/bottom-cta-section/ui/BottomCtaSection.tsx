import { APP_STORE_URL } from "@/shared/config";
import Image from "next/image";

export function BottomCtaSection() {
  return (
    <section className="py-16 md:py-24 bg-muted rounded-2xl mb-8">
      <div className="flex flex-col items-center text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold">
          さあ、あなただけの街を集めよう
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          今すぐ無料でダウンロード
        </p>
        <div className="mt-8">
          <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
            <Image
              src="/images/badge-app-store.svg"
              alt="App Storeからダウンロード"
              width={200}
              height={67}
              className="inline-block w-[160px] sm:w-[200px] h-auto hover:opacity-80 transition-opacity"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
