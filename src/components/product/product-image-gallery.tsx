import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ProductImageGalleryProps {
  productName: string;
  isOutOfStock: boolean;
}

export function ProductImageGallery({ productName, isOutOfStock }: ProductImageGalleryProps) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg border">
        <Image
          src="/images/not-found-product.webp"
          alt={productName || "Ürün"}
          fill
          className="object-cover"
          priority
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="text-lg">
              Stokta Yok
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
} 