"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export interface UseDataTableReturn {
  currentPage: number;
  pageSize: number;
  globalFilter: string;
  debouncedGlobalFilter: string;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setGlobalFilter: (filter: string) => void;
}

export function useDataTable(): UseDataTableReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedGlobalFilter = useDebounce(globalFilter);

  return {
    currentPage,
    pageSize,
    globalFilter,
    debouncedGlobalFilter,
    setCurrentPage,
    setPageSize,
    setGlobalFilter,
  };
}