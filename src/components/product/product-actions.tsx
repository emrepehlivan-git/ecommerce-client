"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/i18n/client";

interface ProductActionsProps {
  productName: string;
  productDescription?: string;
}

export function ProductActions({ productName, productDescription }: ProductActionsProps) {
  const t = useI18n();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted
        ? t("products.actions.removedFromWishlist")
        : t("products.actions.addedToWishlist")
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName || "",
          text: productDescription || "",
          url: window.location.href,
        });
      } catch (error) {
        toast.error((error as Error).message);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("products.actions.linkCopied"));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleWishlist}
        className={isWishlisted ? "text-red-500" : ""}
      >
        <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
      </Button>

      <Button variant="ghost" size="icon" onClick={handleShare}>
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
