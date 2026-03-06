"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[260px]">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <nav className="flex flex-col gap-4 mt-8">
          <Link
            href="#how-it-works"
            className="text-sm font-medium hover:text-primary"
            onClick={() => setOpen(false)}
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link>
          <hr />
          <Link
            href="/auth/login"
            className="text-sm font-medium hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Log in
          </Link>
          <Button asChild size="sm" onClick={() => setOpen(false)}>
            <Link href="/record">Record a pitch</Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
