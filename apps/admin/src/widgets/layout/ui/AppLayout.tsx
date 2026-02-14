"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { XIcon } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Sidebar } from "@/widgets/sidebar/ui";
import { Header } from "@/widgets/header/ui";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetClose,
} from "@/shared/ui/sheet";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-60 gap-0 p-0 [&>button:last-child]:hidden"
        >
          <VisuallyHidden.Root>
            <SheetTitle>ナビゲーションメニュー</SheetTitle>
          </VisuallyHidden.Root>
          <div className="flex h-11 shrink-0 items-center justify-between px-3">
            <Link
              href="/"
              className="flex items-center gap-1.5"
              onClick={() => setSidebarOpen(false)}
            >
              <Image
                src="/machikore-icon.webp"
                alt="Machikore"
                width={24}
                height={24}
                sizes="24px"
                className="h-6 w-6 rounded"
              />
              <Image
                src="/machikore_kanri_font.svg"
                alt="街コレ管理"
                width={120}
                height={22}
                className="h-4 w-auto"
              />
            </Link>
            <SheetClose className="rounded-sm opacity-70 transition-opacity hover:opacity-100">
              <XIcon className="size-4" />
            </SheetClose>
          </div>
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Header - 全幅固定 */}
      <Header onMenuClick={() => setSidebarOpen(true)} />

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden min-[1152px]:flex w-60 shrink-0">
          <Sidebar />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto py-10">
          <div className="px-4 sm:px-6 min-[1152px]:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
