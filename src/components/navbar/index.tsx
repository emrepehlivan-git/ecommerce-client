"use client";

import * as React from "react";
import { TopBar } from "./top-bar";
import { Logo } from "./logo";
import { DesktopNavigation } from "./desktop-navigation";
import { MobileNavigation } from "./mobile-navigation";
import { SearchBar } from "./search-bar";
import { UserActions } from "./user-actions";

export function Navbar() {
  const [cartItemCount, setCartItemCount] = React.useState(3);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <TopBar />

      <SearchBar />
      <div className="flex h-16 items-center px-5">
        <div className="flex items-center gap-4">
          <MobileNavigation cartItemCount={cartItemCount} />
          <Logo />
        </div>

        <div className="hidden md:flex flex-1 justify-center mx-8">
          <DesktopNavigation />
        </div>

        <div className="flex items-center gap-3">
          <UserActions cartItemCount={cartItemCount} />
        </div>
      </div>
    </header>
  );
}
