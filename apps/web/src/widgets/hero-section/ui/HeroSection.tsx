import { Button } from "@/shared/ui/button";
import { APP_STORE_URL } from "@/shared/config";

export function HeroSection() {
  return (
    <section className="py-12 md:py-20 text-center">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
        街の「お気に入り」を
        <br />
        コレクションしよう
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
        あなたの街のお気に入りスポットをマップにまとめて共有。
        誰かの「好き」が、次の冒険のきっかけに。
      </p>
      <div className="mt-8 flex items-center justify-center gap-4">
        <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
          <Button size="lg">アプリをダウンロード</Button>
        </a>
      </div>
    </section>
  );
}
