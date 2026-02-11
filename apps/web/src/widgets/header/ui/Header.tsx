import Link from "next/link";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { APP_STORE_URL } from "@/shared/config";
import { NavLink } from "./NavLink";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/machikore7.png"
            alt="街コレ"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg"
          />
          <span className="font-bold text-lg">街コレ</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/guide">ガイド</NavLink>
          <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm">アプリで開く</Button>
          </a>
        </nav>

        {/* Mobile Nav */}
        <MobileNav />
      </div>
    </header>
  );
}
