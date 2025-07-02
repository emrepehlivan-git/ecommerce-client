"use client";

import { useI18n } from "@/i18n/client";

interface ProductDescriptionProps {
  description: string;
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  const t = useI18n();

  if (!description) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{t("products.description.title")}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
