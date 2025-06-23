"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  return (
    <div className="w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Ürün, kategori ara..."
          className="w-full pl-10 pr-4 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
