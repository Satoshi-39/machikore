"use client";

import { useEffect } from "react";
import { APP_NAME, APP_STORE_URL, PLAY_STORE_URL } from "@/shared/config";

type ShareLandingPageProps = {
  title: string;
  description: string;
  imageUrl: string | null;
  deepLink: string;
};

export function ShareLandingPage({
  title,
  description,
  imageUrl,
  deepLink,
}: ShareLandingPageProps) {
  // アプリがインストールされている場合は自動でディープリンクを試行
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = deepLink;
    }, 100);
    return () => clearTimeout(timer);
  }, [deepLink]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-5">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="mb-4 aspect-video w-full rounded-xl object-cover"
          />
        )}

        <h1 className="mb-2 text-2xl font-bold text-gray-800">{title}</h1>
        <p className="mb-6 leading-relaxed text-gray-600">{description}</p>

        <div className="flex flex-col gap-3">
          <a
            href={deepLink}
            className="block rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            {APP_NAME}で開く
          </a>
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          <a href={APP_STORE_URL}>
            <img
              src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/ja-jp"
              alt="App Store"
              className="h-10"
            />
          </a>
          <a href={PLAY_STORE_URL}>
            <img
              src="https://play.google.com/intl/en_us/badges/static/images/badges/ja_badge_web_generic.png"
              alt="Google Play"
              className="h-14 -mt-1.5"
            />
          </a>
        </div>
      </div>
    </main>
  );
}
