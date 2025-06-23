"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, ArrowUpDown } from "lucide-react";

const sortOptions = [
  { value: "Name asc", label: "İsme Göre (A-Z)" },
  { value: "Name desc", label: "İsme Göre (Z-A)" },
  { value: "Price asc", label: "Fiyata Göre (Düşük-Yüksek)" },
  { value: "Price desc", label: "Fiyata Göre (Yüksek-Düşük)" },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("orderBy") || "";

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    
    // Sadece page parametresini koru
    const currentPage = searchParams.get("page");
    
    if (currentPage && currentPage !== "1") {
      params.set("page", currentPage);
    }
    
    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : "";
    router.push(window.location.pathname + url);
  };

  const hasFilters = (() => {
    const params = new URLSearchParams(searchParams);
    // Page parametresini kaldır
    params.delete("page");
    // Geriye kalan parametreler varsa filtre var demektir
    return params.toString() !== "";
  })();

  return (
    <Card className="mb-6 shadow-sm border-gray-200">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Sıralama Dropdown */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-blue-600" />
              <label className="text-sm font-semibold text-gray-800">Sıralama</label>
            </div>
            <Select value={currentSort || undefined} onValueChange={(value) => updateURL("orderBy", value)}>
              <SelectTrigger className="w-full sm:w-56 h-10 border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors">
                <SelectValue placeholder="Sıralama seçin" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="hover:bg-blue-50 hover:text-blue-900"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasFilters && (
            <Button 
              variant="outline" 
              onClick={clearFilters} 
              className="shrink-0 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Filtreleri Temizle
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 