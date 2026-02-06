import Link from "next/link";

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} 街コレ
        </p>
        <nav className="flex gap-4 text-xs text-gray-500">
          <Link href="/terms" className="hover:text-gray-900 transition-colors">
            利用規約
          </Link>
          <Link href="/privacy" className="hover:text-gray-900 transition-colors">
            プライバシーポリシー
          </Link>
          <Link href="/support" className="hover:text-gray-900 transition-colors">
            お問い合わせ
          </Link>
        </nav>
      </div>
    </footer>
  );
}
