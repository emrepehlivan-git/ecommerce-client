import { Suspense } from "react";
import { FeaturedProducts } from "@/components/product/products-list";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { getI18n } from "@/i18n/server";
import { auth } from "@/lib/auth";

export default async function Home() {
  const t = await getI18n();
  const session = await auth();
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-12 text-center">
        <h3 className="text-4xl font-bold text-gray-900 mb-4">{t("welcome")}</h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("home.description")}</p>
      </div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <Suspense fallback={<ProductGridSkeleton count={10} />}>
        <FeaturedProducts />
      </Suspense>
    </div>
  );
}
