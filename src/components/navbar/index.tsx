"use client";

import * as React from "react";
import { TopBar } from "./top-bar";
import { Logo } from "./logo";
import { DesktopNavigation } from "./desktop-navigation";
import { MobileNavigation } from "./mobile-navigation";
import { SearchBar } from "./search-bar";
import { UserActions } from "./user-actions";
import { useGetApiCategory } from "@/api/generated/category/category";

export function Navbar() {
  const [cartItemCount, setCartItemCount] = React.useState(3);
  const { data: categories } = useGetApiCategory();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <TopBar />
      
      {/* Main navbar */}
      <div className="flex h-16 items-center px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <MobileNavigation
            cartItemCount={cartItemCount}
            categories={categories?.data || []}
          />
          <Logo />
        </div>

        <div className="flex-1 flex justify-center mx-8">
          <SearchBar />
        </div>

        <div className="flex items-center">
          <UserActions cartItemCount={cartItemCount} />
        </div>
      </div>

      {/* Category navigation */}
      <div className="border-t bg-white px-4 lg:px-6 py-2">
        <DesktopNavigation categories={categories?.data || []} />
      </div>
    </header>
  );
}
