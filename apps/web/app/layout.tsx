import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://machikore.io"),
  title: {
    default: "街コレ - 新しい街を発見する地図型SNS",
    template: "%s | 街コレ",
  },
  description:
    "あなたの街のお気に入りスポットをコレクションして共有しよう。誰かの「好き」が、次の冒険のきっかけに。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://machikore.io",
    siteName: "街コレ",
    title: "街コレ - 新しい街を発見する地図型SNS",
    description:
      "あなたの街のお気に入りスポットをコレクションして共有しよう。誰かの「好き」が、次の冒険のきっかけに。",
    images: [
      {
        url: "/images/ogp-default.png",
        width: 1200,
        height: 630,
        alt: "街コレ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "街コレ - 新しい街を発見する地図型SNS",
    description:
      "あなたの街のお気に入りスポットをコレクションして共有しよう。誰かの「好き」が、次の冒険のきっかけに。",
    images: ["/images/ogp-default.png"],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "街コレ",
    url: "https://machikore.io",
    description:
      "あなたの街のお気に入りスポットをコレクションして共有しよう。誰かの「好き」が、次の冒険のきっかけに。",
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "街コレ",
    operatingSystem: "iOS",
    applicationCategory: "SocialNetworkingApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
    installUrl: "https://apps.apple.com/app/id6755458725",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
