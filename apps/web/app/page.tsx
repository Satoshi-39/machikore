import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <img
          src="/images/machikore7.png"
          alt="街コレ"
          className="w-20 h-20 mx-auto mb-6 rounded-2xl"
        />
        <h1 className="text-4xl font-bold mb-4">街コレ</h1>
        <p className="text-lg mb-8">
          あなたの街のお気に入りスポットをコレクションして共有しよう
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Web版は準備中です
        </p>
        <Link
          href="/support"
          className="text-sm text-blue-600 hover:underline"
        >
          お問い合わせ
        </Link>
      </div>
    </main>
  );
}
