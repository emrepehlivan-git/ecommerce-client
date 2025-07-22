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
  const [isMainImageLoading, setMainImageLoading] = useState(true);
  const [loadingThumbnails, setLoadingThumbnails] = useState<Set<number>>(new Set());
  
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

  const handleThumbnailLoad = (index: number) => {
    setLoadingThumbnails(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const handleImageChange = (index: number) => {
    setSelectedImageIndex(index);
    setMainImageLoading(true);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg border">
        <Image
          src={getCurrentImage()}
          alt={getCurrentImageAlt()}
          fill
          className={`object-cover transition-all duration-500 ${
            isMainImageLoading ? "blur-sm scale-110" : "blur-0 scale-100"
          }`}
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyvcW2YellmjMo3tp5XZOqc2w3DEF2s7FZpMRFhVxDEiZEGI2nD7xUOwMlNhYF+rjD3mNjPdwwcdcyHbJ3+1SqhSUYfcD3RFY4rSb9yEeFVm3BPqNMXw1uXhJktdPPKmEhzKf5yZHmhBLRGK2k6UlBxkSJEsEYnr+Ub0ndGLcjOsB7gtQKajvww3Y6DWQIqlgM86+1BXCPwFhfCXlqfgwVWn0z/2Q=="
          onLoad={() => setMainImageLoading(false)}
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
              onClick={() => handleImageChange(index)}
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
                className={`object-cover transition-all duration-300 ${
                  loadingThumbnails.has(index) ? "blur-sm" : "blur-0"
                }`}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyvcW2YellmjMo3tp5XZOqc2w3DEF2s7FZpMRFhVxDEiZEGI2nD7xUOwMlNhYF+rjD3mNjPdwwcdcyHbJ3+1SqhSUYfcD3RFY4rSb9yEeFVm3BPqNMXw1uXhJktdPPKmEhzKf5yZHmhBLRGK2k6UlBxkSJEsEYnr+Ub0ndGLcjOsB7gtQKajvww3Y6DWQIqlgM86+1BXCPwFhfCXlqfgwVWn0z/2Q=="
                onLoad={() => handleThumbnailLoad(index)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 