"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export interface UseTableParamsReturn {
  globalFilter: string;
  isSearching: boolean;
  handlePageChange: (newPage: number) => void;
  handlePageSizeChange: (newPageSize: number) => void;
  handleFilterChange: (value: string) => void;
}

export function useTableParams(): UseTableParamsReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [globalFilter, setGlobalFilter] = useState(searchParams.get("search") ?? "");
  const debouncedFilter = useDebounce(globalFilter);
  const [isSearching, setIsSearching] = useState(false);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", String(newPageSize));
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const currentSearch = searchParams.get("search") ?? "";
    if (debouncedFilter !== currentSearch) {
      setIsSearching(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set("search", debouncedFilter);
      params.set("page", "1");
      router.push(`?${params.toString()}`);
    }
  }, [debouncedFilter, router, searchParams]);

  useEffect(() => {
    const currentSearchInUrl = searchParams.get("search") ?? "";
    if (currentSearchInUrl !== globalFilter) {
      setGlobalFilter(currentSearchInUrl);
    }
    setIsSearching(false);
  }, [searchParams, globalFilter]);

  const handleFilterChange = (value: string) => {
    setGlobalFilter(value);
  };

  return {
    globalFilter,
    isSearching,
    handlePageChange,
    handlePageSizeChange,
    handleFilterChange,
  };
}