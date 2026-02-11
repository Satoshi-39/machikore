"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { APP_STORE_URL } from "@/shared/config";
import { NavLink } from "./NavLink";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">メニュー</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <SheetHeader>
          <SheetTitle>メニュー</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-6">
          <NavLink href="/guide" onClick={() => setOpen(false)}>
            ガイド
          </NavLink>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button className="w-full">アプリで開く</Button>
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
