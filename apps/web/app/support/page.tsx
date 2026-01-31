import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ - 街コレ",
  description: "街コレに関するお問い合わせはこちらからお願いいたします。",
};

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfsMy_VFM0JPLIermha8Dcp61Uc1qFBqkAo0OJ9_3cinaMt4w/viewform?embedded=true";

const SUPPORT_EMAIL = "support@machikore.io";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            お問い合わせ
          </h1>
          <p className="text-gray-600">
            街コレに関するご質問・ご要望・不具合のご報告など、
            <br />
            お気軽にお問い合わせください。
          </p>
        </div>

        {/* Googleフォーム埋め込み */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <iframe
            src={GOOGLE_FORM_URL}
            width="100%"
            height="800"
            className="border-0"
            title="お問い合わせフォーム"
          >
            読み込み中...
          </iframe>
        </div>

        {/* メールでの問い合わせ */}
        <div className="text-center text-sm text-gray-500">
          <p>
            フォームが表示されない場合は、メールでもお問い合わせいただけます。
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-blue-600 hover:underline mt-1 inline-block"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </main>
  );
}
