
import { getApiCategoryId } from "@/api/generated/category/category";
import { ProductInfiniteScroll } from "@/components/product/product-infinite-scroll";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home, Package } from "lucide-react";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;

    const categoryResponse = await getApiCategoryId(id);
    const category = categoryResponse.data;

    return (
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Ana Sayfa
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {category?.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {category?.name}
              </h2>
              {category?.description && (
                <p className="text-gray-600 mt-1">{category.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Products with Infinite Scroll */}
        <Suspense fallback={<ProductGridSkeleton count={12} />}>
          <ProductInfiniteScroll 
            categoryId={id}
          />
        </Suspense>
      </div>
    );
} 