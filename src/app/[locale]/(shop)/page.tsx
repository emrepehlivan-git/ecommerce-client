import { Suspense } from "react";
import { FeaturedProducts } from "@/components/product/products-list";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { HeroSection } from "@/components/ui/hero-section";

export default async function Home() {
    return (
    <div className="container mx-auto px-4 py-6">
      <HeroSection
        primaryAction={{
          href: "/products",
        }}
      />
      <Suspense fallback={<ProductGridSkeleton count={10} />}>
        <FeaturedProducts />
      </Suspense>
    </div>
  );
}
