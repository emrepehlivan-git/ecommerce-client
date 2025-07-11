import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ProductImageResponseDto } from "@/api/generated/model";
import { useState } from "react";

interface ProductImageGalleryProps {
  productName: string;
  isOutOfStock: boolean;
  images?: ProductImageResponseDto[] | null;
}

export function ProductImageGallery({ productName, isOutOfStock, images }: ProductImageGalleryProps) {
  const activeImages = images?.filter(img => img.isActive)?.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)) || [];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const getCurrentImage = () => {
    if (activeImages.length > 0) {
      const currentImage = activeImages[selectedImageIndex];
      return currentImage?.largeUrl || currentImage?.imageUrl || "/images/not-found-product.webp";
    }
    return "/images/not-found-product.webp";
  };

  const getCurrentImageAlt = () => {
    if (activeImages.length > 0) {
      return activeImages[selectedImageIndex]?.altText || productName || "Ürün";
    }
    return productName || "Ürün";
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg border">
        <Image
          src={getCurrentImage()}
          alt={getCurrentImageAlt()}
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
      
      {activeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {activeImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative aspect-square overflow-hidden rounded border-2 transition-all ${
                selectedImageIndex === index 
                  ? "border-primary shadow-md" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image
                src={image.thumbnailUrl || image.imageUrl || "/images/not-found-product.webp"}
                alt={image.altText || `${productName} - Görsel ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 