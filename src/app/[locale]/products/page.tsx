import { Suspense } from "react";
import { ProductInfiniteScroll } from "@/components/product/product-infinite-scroll";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, Package } from "lucide-react";
import { getI18n } from "@/i18n/server";

export default async function ProductsPage() {
  const t = await getI18n();
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              {t("products.page.breadcrumb.home")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("products.page.breadcrumb.allProducts")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Package className="h-8 w-8 text-primary" />
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{t("products.page.header.title")}</h3>
            <p className="text-gray-600 mt-1">{t("products.page.header.description")}</p>
          </div>
        </div>
      </div>

      {/* Products List */}
      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <ProductInfiniteScroll initialPageSize={12} />
      </Suspense>
    </div>
  );
}
