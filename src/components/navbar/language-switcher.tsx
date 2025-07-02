"use client";

import { Globe } from "lucide-react";

import { useChangeLocale } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TrFlag from "@/components/icons/tr-flag";
import UkFlag from "@/components/icons/uk-flag";

export function LanguageSwitcher() {
  const changeLocale = useChangeLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLocale("en")}>
          <UkFlag className="h-4 w-6 mr-2" />
          <span>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLocale("tr")}>
          <TrFlag className="h-4 w-6 mr-2" />
          <span>Türkçe</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
