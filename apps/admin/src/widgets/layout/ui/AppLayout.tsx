"use client";

import { useState } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Sidebar } from "@/widgets/sidebar/ui";
import { Header } from "@/widgets/header/ui";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/sheet";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-60 p-0">
          <VisuallyHidden.Root>
            <SheetTitle>ナビゲーションメニュー</SheetTitle>
          </VisuallyHidden.Root>
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
