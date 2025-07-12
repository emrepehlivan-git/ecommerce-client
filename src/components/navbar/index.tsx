"use client";

import * as React from "react";
import { TopBar } from "./top-bar";
import { Logo } from "./logo";
import { MobileNavigation } from "./mobile-navigation";
import { SearchBar } from "./search-bar";
import { UserActions } from "../user/user-actions";
import { CategoryNavigation } from "../category/category-navigation";
import { useGetApiV1Category } from "@/api/generated/category/category";
import { useAppStore } from "@/stores/useAppStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { LanguageSwitcher } from "./language-switcher";

export function Navbar() {
  const { totalItems: cartItemCount } = useAppStore();
  const { data } = useGetApiV1Category();
  const isMobile = useIsMobile();
  const categories = data?.value || [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <TopBar />

      <div className="flex h-16 items-center px-4 lg:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <MobileNavigation categories={categories} />
          <Logo />
        </div>

        <div className="hidden md:flex flex-1 justify-center mx-8">
          <SearchBar />
        </div>

        <div className="flex items-center ml-auto gap-2">
          <LanguageSwitcher />
          <UserActions cartItemCount={cartItemCount} />
        </div>
      </div>

      <div className="md:hidden px-4 pb-3 border-t bg-white">
        <SearchBar />
      </div>

      <div className="border-t bg-white px-4 lg:px-6 py-3">
        <div className="hidden md:block">
          <CategoryNavigation categories={categories} maxVisible={10} />
        </div>
      </div>
    </header>
  );
}
