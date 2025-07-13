import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { getI18n } from "@/i18n/server";

export default async function ProductNotFound() {
  const t = await getI18n();
  
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="relative aspect-square mx-auto max-w-xs">
          <Image
            src="/images/not-found-product.webp"
            alt="Ürün bulunamadı"
            fill
            className="object-contain opacity-50"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">{t("products.notFound.title")}</h1>
          <p className="text-gray-600">{t("products.notFound.description")}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("products.notFound.backToProducts")}
            </Link>
          </Button>

          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {t("products.notFound.home")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
