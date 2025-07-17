"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package } from "lucide-react";
import { useI18n } from "@/i18n/client";

export function EmptyCart() {
  const t = useI18n();
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <div className="relative">
          <div className="bg-gray-100 rounded-full p-8">
            <ShoppingCart className="h-16 w-16 text-gray-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-blue-100 rounded-full p-2">
            <Package className="h-6 w-6" />
          </div>
        </div>

        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-gray-900">{t("cart.empty")}</h2>
          <p className="text-gray-600 leading-relaxed">
            {t("cart.emptyDescription")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button asChild size="lg" className="px-8">
            <Link href="/products">
              <ShoppingCart className="mr-2 h-5 w-5" />
              {t("cart.startShopping")}
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 w-full max-w-2xl">
          <div className="text-center space-y-2">
            <div className="bg-green-100 rounded-full p-3 w-fit mx-auto">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900">{t("cart.freeShipping")}</h3>
            <p className="text-sm text-gray-600">{t("cart.freeShippingDescription")}</p>
          </div>

          <div className="text-center space-y-2">
            <div className="bg-blue-100 rounded-full p-3 w-fit mx-auto">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-gray-900">{t("cart.easyReturn")}</h3>
            <p className="text-sm text-gray-600">{t("cart.easyReturnDescription")}</p>
          </div>

          <div className="text-center space-y-2">
            <div className="bg-purple-100 rounded-full p-3 w-fit mx-auto">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900">{t("cart.fastDelivery")}</h3>
            <p className="text-sm text-gray-600">{t("cart.fastDeliveryDescription")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
