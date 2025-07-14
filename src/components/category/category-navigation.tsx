"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { 
  Search,
  Loader2,
  Grid3X3,
} from "lucide-react";

import { useGetApiV1CategoryInfinite} from "@/api/generated/category/category";
import { CategoryDtoListPagedResult } from "@/api/generated/model";
import { useDebounce } from "@/hooks/use-debounce";
import { useI18n } from "@/i18n/client";

interface CategoryNavigationProps {
  className?: string;
  maxVisible?: number;
  showSearchButton?: boolean;
}

export function CategoryNavigation({ 
  className,
  maxVisible = 6,
  showSearchButton = true
}: CategoryNavigationProps) {
  const t = useI18n();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    if (value) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, []);
  
  const {data: featuredData, isLoading: featuredLoading, isError: featuredError} = useGetApiV1CategoryInfinite({
    PageSize: maxVisible
  }, {
    query: {
      getNextPageParam: () => undefined,
      initialPageParam: 1,
    }
  });

  const {data: searchData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: searchLoading, isRefetching} = useGetApiV1CategoryInfinite({
    PageSize: 20,
    ...(debouncedSearchTerm && { Search: debouncedSearchTerm })
  }, {
    query: {
      getNextPageParam: (lastPage: CategoryDtoListPagedResult) => {
        const pagedInfo = lastPage.pagedInfo;
        if (
          pagedInfo &&
          pagedInfo.pageNumber &&
          pagedInfo.totalPages &&
          pagedInfo.pageNumber < pagedInfo.totalPages
        ) {
          return pagedInfo.pageNumber + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
      enabled: isSearchOpen,
      keepPreviousData: false,
    }
  });

  useEffect(() => {
    if (searchTerm && debouncedSearchTerm === searchTerm) {
      setIsSearching(false);
    }
  }, [debouncedSearchTerm, searchTerm]);

  const featuredCategories = useMemo(() => {
    return featuredData?.pages[0]?.value || [];
  }, [featuredData]);

  const searchCategories = useMemo(() => {
    return searchData?.pages.flatMap(page => page?.value || []) || [];
  }, [searchData]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop <= clientHeight * 1.5;
    
    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  
  if (featuredLoading) {
    return (
      <div className={cn("w-full space-y-3", className)}>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    );
  }
  
  if (featuredError) {
    return (
      <div className={cn("w-full p-2 text-center text-red-500 text-sm", className)}>
        {t("categoryNavigation.failedToLoad")}
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <ScrollArea className="w-full">
        <div className="flex items-center gap-2 pb-2">
          {featuredCategories.map((category) => {
            const href = `/category/${category.id}`;
            const isActive = pathname?.startsWith(href);
            
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "flex-shrink-0 transition-all duration-300 whitespace-nowrap relative",
                  isActive 
                    ? "bg-primary hover:bg-primary/90 text-white shadow-md" 
                    : "hover:bg-primary/10 hover:text-primary text-gray-700"
                )}
                asChild
              >
                <Link href={href}>
                  {category.name}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  )}
                </Link>
              </Button>
            );
          })}
          
          {showSearchButton && (
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0 hover:bg-primary/5"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-3 w-3 mr-1" />
              <span className="text-xs">{t("categoryNavigation.more")}</span>
            </Button>
          )}
        </div>
      </ScrollArea>

      <CommandDialog 
        open={isSearchOpen} 
        onOpenChange={setIsSearchOpen}
        title={t("categoryNavigation.searchDialogTitle")}
        description={t("categoryNavigation.searchDialogDescription")}
      >
        <CommandInput 
          placeholder={t("categoryNavigation.searchInputPlaceholder")}
          value={searchTerm}
          onValueChange={handleSearch}
        />
        <CommandList 
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-h-[400px]"
        >
          {(searchLoading || isRefetching || isSearching) ? (
            <CommandGroup>
              <div className="space-y-2 p-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-8 w-2/3" />
              </div>
            </CommandGroup>
          ) : (
            <>
              {searchCategories.length === 0 && debouncedSearchTerm && (
                <CommandEmpty>{t("categoryNavigation.noCategoriesFound")}</CommandEmpty>
              )}
              {searchCategories.length === 0 && !debouncedSearchTerm && (
                <CommandEmpty>{t("categoryNavigation.startTyping")}</CommandEmpty>
              )}
              {searchCategories.length > 0 && (
                <CommandGroup>
                  <div className="flex items-center justify-between px-2 py-1 text-xs text-muted-foreground border-b">
                    <div className="flex items-center gap-2">
                      <Grid3X3 className="h-3 w-3" />
                      <span>{t("categoryNavigation.categoriesCount", { count: searchCategories.length })}</span>
                    </div>
                    {hasNextPage && (
                      <Badge variant="secondary" className="text-xs">
                        <Loader2 className={cn("h-3 w-3 mr-1", isFetchingNextPage ? "animate-spin" : "hidden")} />
                        {isFetchingNextPage ? t("categoryNavigation.loading") : t("categoryNavigation.moreAvailable")}
                      </Badge>
                    )}
                  </div>
                  {searchCategories.map((category) => {
                    const href = `/category/${category.id}`;
                    const isActive = pathname?.startsWith(href);
                    return (
                      <CommandItem 
                        key={category.id} 
                        value={category.name ?? ""}
                        className={cn(
                          "cursor-pointer",
                          isActive && "bg-primary text-primary-foreground"
                        )}
                        onSelect={() => {
                          setIsSearchOpen(false);
                        }}
                        asChild
                      >
                        <Link href={href}>
                          <span>{category.name}</span>
                          {isActive && (
                            <Badge variant="secondary" className="ml-auto">
                              {t("categoryNavigation.active")}
                            </Badge>
                          )}
                        </Link>
                      </CommandItem>
                    );
                  })}
                  {isFetchingNextPage && (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm text-muted-foreground">{t("categoryNavigation.loadingMore")}</span>
                    </div>
                  )}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
}