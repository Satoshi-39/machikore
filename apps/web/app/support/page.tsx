import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ - 街コレ",
  description: "街コレに関するお問い合わせはこちらからお願いいたします。",
};

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfsMy_VFM0JPLIermha8Dcp61Uc1qFBqkAo0OJ9_3cinaMt4w/viewform?usp=sf_link";

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

        {/* お問い合わせフォームリンク */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 text-center">
          <p className="text-gray-700 mb-6">
            以下のリンクよりお問い合わせフォームにご回答ください。
          </p>
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white font-medium px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            お問い合わせフォームを開く
          </a>
        </div>

        {/* メールでの問い合わせ */}
        <div className="text-center text-sm text-gray-500">
          <p>メールでもお問い合わせいただけます。</p>
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
