"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar() {
  const [selectedLanguage, setSelectedLanguage] = useState("🇹🇷");
  return (
    <div className="hidden border-b bg-muted/40 px-4 py-1.5 text-xs md:flex md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <span>Müşteri Hizmetleri: 0850 123 45 67</span>
        <Link href="/yardim" className="hover:underline">
          Yardım
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto p-0 text-base">
              {selectedLanguage} <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedLanguage("🇹🇷")}>
              🇹🇷 Türkçe
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedLanguage("🇺🇸")}>
              🇺🇸 English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
