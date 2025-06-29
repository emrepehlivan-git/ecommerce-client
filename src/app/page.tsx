import { Suspense } from "react";
import { FeaturedProducts } from "@/components/product/products-list";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-12 text-center">
        <h3 className="text-4xl font-bold text-gray-900 mb-4">
          Hoş Geldiniz
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          En kaliteli ürünleri uygun fiyatlarla bulabileceğiniz e-ticaret platformu. 
          Geniş ürün yelpazemiz ile ihtiyacınız olan her şeyi tek noktadan temin edebilirsiniz.
        </p>
      </div>
    
      <Suspense fallback={<ProductGridSkeleton count={10} />}>
        <FeaturedProducts />
      </Suspense>
    </div>
  );
}
