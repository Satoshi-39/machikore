import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { NavLink } from "./NavLink";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/images/machikore7.png"
            alt="街コレ"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg"
          />
          <Image
            src="/images/machikore_font.svg"
            alt="街コレ"
            width={58}
            height={19}
            className="h-[19px] w-auto"
          />
        </Link>

        {/* Nav */}
        <nav className="flex items-center">
          <NavLink href="/support" className="flex items-center gap-1.5">
            <Mail className="h-4 w-4" />
            お問い合わせ
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
