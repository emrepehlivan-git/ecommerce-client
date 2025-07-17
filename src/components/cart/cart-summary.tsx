"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, CreditCard } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";
import { useI18n } from "@/i18n/client";

interface CartSummaryProps {
  totalItems: number;
  totalAmount: number;
}

export function CartSummary({ totalItems, totalAmount }: CartSummaryProps) {
  const t = useI18n();
  const shippingCost = totalAmount > 500 ? 0 : 29.99;
  const finalTotal = totalAmount + shippingCost;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          {t("cart.orderSummary")}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t("cart.productCount")}:</span>
            <span>{totalItems} {t("cart.items")}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>{t("cart.subtotal")}:</span>
            <span>₺{formatPrice(totalAmount)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>{t("cart.shippingCost")}:</span>
            <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
              {shippingCost === 0 ? t("cart.free") : `₺${formatPrice(shippingCost)}`}
            </span>
          </div>
          
          {totalAmount < 500 && (
            <div className="bg-primary/10 p-3 rounded-md text-sm">
              ₺{formatPrice(500 - totalAmount)} {t("cart.moreShopping")}
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>{t("cart.total")}:</span>
          <span className="text-primary">₺{formatPrice(finalTotal)}</span>
        </div>

        <div className="space-y-3 pt-4">
          <Button asChild className="w-full h-12 text-lg">
            <Link href="/checkout">
              <CreditCard className="mr-2 h-5 w-5" />
              {t("cart.checkout")}
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/products">
              {t("cart.continueShopping")}
            </Link>
          </Button>
        </div>

        <div className="pt-4 space-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{t("cart.securePayment")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{t("cart.freeReturn")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{t("cart.fastDelivery")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 