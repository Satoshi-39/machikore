import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { NavLink } from "./NavLink";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex h-16 lg:h-18 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 lg:gap-2">
          <Image
            src="/images/machikore7.png"
            alt="街コレ"
            width={48}
            height={48}
            className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg"
          />
          <Image
            src="/images/machikore_font.svg"
            alt="街コレ"
            width={96}
            height={32}
            className="h-5 lg:h-7 w-auto"
          />
        </Link>

        {/* Nav */}
        <nav className="flex items-center">
          <NavLink href="/support" className="flex items-center gap-1.5 lg:gap-2 text-base lg:text-lg">
            <Mail className="h-5 w-5 lg:h-6 lg:w-6" />
            お問い合わせ
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
