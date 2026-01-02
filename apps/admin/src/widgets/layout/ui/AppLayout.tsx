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
    <>
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <VisuallyHidden.Root>
            <SheetTitle>ナビゲーションメニュー</SheetTitle>
          </VisuallyHidden.Root>
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
}
