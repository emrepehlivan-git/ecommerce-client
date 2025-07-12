import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function ProductNotFound() {
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
          <h1 className="text-2xl font-bold text-gray-900">Ürün Bulunamadı</h1>
          <p className="text-gray-600">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ürünlere Dön
            </Link>
          </Button>

          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ana Sayfa
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
