"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { useI18n } from "@/i18n/client";

interface ProductSortDropdownProps {
  className?: string;
}

export function ProductSortDropdown({ className = "" }: ProductSortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useI18n();

  const sortOptions = [
    { value: "Name asc", label: t("products.sortDropdown.nameAsc") },
    { value: "Name desc", label: t("products.sortDropdown.nameDesc") },
    { value: "Price asc", label: t("products.sortDropdown.priceAsc") },
    { value: "Price desc", label: t("products.sortDropdown.priceDesc") },
  ];

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
          <SelectValue placeholder={t("products.sortDropdown.placeholder")} />
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
