"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

const sortOptions = [
  { value: "Name asc", label: "İsme Göre (A-Z)" },
  { value: "Name desc", label: "İsme Göre (Z-A)" },
  { value: "Price asc", label: "Fiyata Göre (Düşük-Yüksek)" },
  { value: "Price desc", label: "Fiyata Göre (Yüksek-Düşük)" },
];

interface ProductSortDropdownProps {
  className?: string;
}

export function ProductSortDropdown({ className = "" }: ProductSortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("orderBy") || "";

  const updateSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "default") {
      params.set("orderBy", value);
    } else {
      params.delete("orderBy");
    }
    params.delete("page");
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ArrowUpDown className="h-4 w-4 text-gray-500" />
      <Select value={currentSort || undefined} onValueChange={updateSort}>
        <SelectTrigger className="w-48 h-9 text-sm border-gray-300 hover:border-blue-400 focus:border-blue-500">
          <SelectValue placeholder="Varsayılan Sıralama" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="text-sm hover:bg-blue-50"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 