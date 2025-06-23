"use client";

import { useGetApiProductInfinite, useGetApiProductCategoryCategoryId } from "@/api/generated/product/product";
import { ProductCard } from "./product-card";
import { ProductGridSkeleton } from "./product-grid-skeleton";
import { ProductSortDropdown } from "./product-sort-dropdown";
import { useSearchParams } from "next/navigation";
import { useMemo, useEffect, useRef, useCallback } from "react";
import { ProductDto, ProductDtoListPagedResult } from "@/api/generated/model";
import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductInfiniteScrollProps {
  initialPageSize?: number;
  categoryId?: string;
}

export function ProductInfiniteScroll({ 
  initialPageSize = 12, 
  categoryId 
}: ProductInfiniteScrollProps) {
  const searchParams = useSearchParams();
  const loadingRef = useRef<HTMLDivElement>(null);
  
  const queryParams = useMemo(() => ({
    PageSize: initialPageSize,
    orderBy: searchParams.get("orderBy") || undefined,
    includeCategory: searchParams.get("includeCategory") === 'true',
  }), [searchParams, initialPageSize]);

  // Kategoriye göre farklı hook kullan
  const allProductsQuery = useGetApiProductInfinite(queryParams, {
    query: {
      enabled: !categoryId, // Sadece kategori yoksa çalışsın
      getNextPageParam: (lastPage: { data: ProductDtoListPagedResult }) => {
        const pagedInfo = lastPage.data.pagedInfo;
        if (pagedInfo && pagedInfo.pageNumber && pagedInfo.totalPages && pagedInfo.pageNumber < pagedInfo.totalPages) {
          return pagedInfo.pageNumber + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
    }
  });

  // Kategori ürünleri için normal query kullan (pagination yok)
  const categoryProductsQuery = useGetApiProductCategoryCategoryId(
    categoryId || '', 
    {
      query: {
        enabled: !!categoryId, // Sadece kategori varsa çalışsın
      }
    }
  );

  // Aktif query'ye göre verileri işle
  const { isLoading, isError, error } = categoryId ? categoryProductsQuery : allProductsQuery;
  
  // Infinite scroll için gerekli değerler (sadece all products için)
  const { data: infiniteData, fetchNextPage, hasNextPage, isFetchingNextPage } = allProductsQuery;
  
  // Category products için data
  const { data: categoryData } = categoryProductsQuery;

  // Intersection Observer ile otomatik yükleme (sadece all products için)
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (!categoryId && entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [categoryId, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (categoryId) return; // Kategori varsa infinite scroll'u deaktif et
    
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '100px', // 100px önce tetikle
      threshold: 0.1,
    });

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [categoryId, handleIntersection]);

  // Ürünleri al
  const allProducts = useMemo(() => {
    if (categoryId && categoryData?.data?.value) {
      // Kategori ürünleri
      return Array.isArray(categoryData.data.value) ? categoryData.data.value : [];
    } else if (!categoryId && infiniteData?.pages) {
      // Tüm ürünler (infinite scroll)
      return infiniteData.pages.reduce((acc: ProductDto[], page) => {
        const products = page.data?.value || [];
        if (Array.isArray(products)) {
          return [...acc, ...products];
        }
        return acc;
      }, []);
    }
    return [];
  }, [categoryId, categoryData, infiniteData]);

  const totalRecords = categoryId 
    ? (categoryData?.data?.pagedInfo?.totalRecords || allProducts.length)
    : (infiniteData?.pages[0]?.data?.pagedInfo?.totalRecords || 0);

  if (isLoading) {
    return <ProductGridSkeleton count={initialPageSize} />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Ürünler yüklenirken bir hata oluştu
        </h3>
        <p className="text-gray-600 mb-4">
          {(error as any)?.message || "Lütfen daha sonra tekrar deneyin."}
        </p>
        <Button 
          onClick={() => window.location.reload()} 
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Sayfayı Yenile
        </Button>
      </div>
    );
  }

  if (allProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">🛍️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {categoryId ? "Bu kategoride henüz ürün bulunamadı" : "Henüz ürün bulunamadı"}
        </h3>
        <p className="text-gray-600">
          {categoryId 
            ? "Bu kategori için farklı filtreler deneyebilir veya diğer kategorilere göz atabilirsiniz." 
            : "Filtreleri değiştirmeyi deneyin veya daha sonra tekrar kontrol edin."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Product Header with Sort and Count */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="text-sm text-gray-600 font-medium">
          <span className="text-gray-900 font-semibold">{allProducts.length}</span> / {" "}
          <span className="text-gray-900 font-semibold">{totalRecords.toLocaleString('tr-TR')}</span> ürün gösteriliyor
        </div>
        
        <ProductSortDropdown />
      </div>

      {/* Ürün listesi */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {allProducts.map((product: ProductDto) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Loading trigger point - sadece infinite scroll için */}
      {!categoryId && hasNextPage && (
        <div 
          ref={loadingRef}
          className="flex justify-center py-8"
        >
          {isFetchingNextPage && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Daha fazla ürün yükleniyor...</span>
            </div>
          )}
        </div>
      )}

      {/* Tüm ürünler yüklendi mesajı - sadece infinite scroll için */}
      {!categoryId && !hasNextPage && allProducts.length > 0 && allProducts.length === totalRecords && (
        <div className="text-center py-8 text-gray-500">
          🎉 Tüm ürünler yüklendi!
        </div>
      )}
    </div>
  );
} 