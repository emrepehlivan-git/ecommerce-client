"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  return (
    <div className="relative max-w-3xl mt-3 mx-auto">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Ürün ara..."
        className="w-full pl-8 pr-4 h-9"
      />
    </div>
  );
}
