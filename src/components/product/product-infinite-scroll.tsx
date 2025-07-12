"use client";

import { useGetApiV1ProductInfinite } from "@/api/generated/product/product";
import { ProductCard } from "./product-card";
import { ProductGridSkeleton } from "./product-grid-skeleton";
import { ProductSortDropdown } from "./product-sort-dropdown";
import { useSearchParams } from "next/navigation";
import { useMemo, useEffect, useRef, useCallback } from "react";
import { ProductDto, ProductDtoListPagedResult } from "@/api/generated/model";
import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/client";

interface ProductInfiniteScrollProps {
  initialPageSize?: number;
  categoryId?: string;
}

export function ProductInfiniteScroll({
  initialPageSize = 12,
  categoryId,
}: ProductInfiniteScrollProps) {
  const searchParams = useSearchParams();
  const loadingRef = useRef<HTMLDivElement>(null);
  const t = useI18n();

  const queryParams = useMemo(
    () => ({
      PageSize: initialPageSize,
      orderBy: searchParams.get("orderBy") || undefined,
      includeCategory: searchParams.get("includeCategory") === "true",
      categoryId: categoryId || undefined,
    }),
    [searchParams, initialPageSize, categoryId]
  );

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useGetApiV1ProductInfinite(queryParams, {
    query: {
      getNextPageParam: (lastPage: ProductDtoListPagedResult) => {
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
    },
  });

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection]);

  const allProducts = infiniteData?.pages.flatMap((page) => page.value || []) || [];
  const totalRecords = infiniteData?.pages[0]?.pagedInfo?.totalRecords || 0;

  if (isLoading) {
    return <ProductGridSkeleton count={initialPageSize} />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("products.infiniteScroll.errorTitle")}
        </h3>
        <p className="text-gray-600 mb-4">
          {(error as unknown as Error)?.message || t("products.infiniteScroll.defaultErrorMessage")}
        </p>
        <Button onClick={() => window.location.reload()}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("products.infiniteScroll.refreshButton")}
        </Button>
      </div>
    );
  }

  if (allProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">🛍️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {categoryId
            ? t("products.infiniteScroll.noProductsInCategoryTitle")
            : t("products.infiniteScroll.noProductsTitle")}
        </h3>
        <p className="text-gray-600">
          {categoryId
            ? t("products.infiniteScroll.noProductsInCategoryDescription")
            : t("products.infiniteScroll.noProductsDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="text-sm text-gray-600 font-medium">
          <span className="text-gray-900 font-semibold">{allProducts.length}</span> /{" "}
          <span className="text-gray-900 font-semibold">
            {totalRecords.toLocaleString("tr-TR")}
          </span>{" "}
          {t("products.infiniteScroll.displayed")}
        </div>

        <ProductSortDropdown />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {allProducts.map((product: ProductDto) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasNextPage && (
        <div ref={loadingRef} className="flex justify-center py-8">
          {isFetchingNextPage && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t("products.infiniteScroll.loadingMore")}</span>
            </div>
          )}
        </div>
      )}

      {!hasNextPage && allProducts.length > 0 && allProducts.length === totalRecords && (
        <div className="text-center py-8 text-gray-500">
          🎉{" "}
          {categoryId
            ? t("products.infiniteScroll.allLoadedInCategory")
            : t("products.infiniteScroll.allLoaded")}{" "}
          {t("products.infiniteScroll.loaded")}
        </div>
      )}
    </div>
  );
}
