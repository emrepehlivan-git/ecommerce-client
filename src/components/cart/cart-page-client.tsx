"use client";

import { useAppStore } from "@/stores/useAppStore";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";
import { EmptyCart } from "./empty-cart";
import { CartSkeleton } from "./cart-skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useI18n } from "@/i18n/client";
import { formatPrice } from "@/lib/formatPrice";

export default function CartPageClient() {
  const t = useI18n();
  const { data: session } = useSession();
  const { cart, isLoadingCart, isCartEmpty, clearCart, totalItems, totalAmount } = useAppStore();

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <ShoppingCart className="h-16 w-16 text-gray-400" />
          <h2 className="text-2xl font-semibold text-gray-700">
            {t("cart.loginTitle")}
          </h2>
          <p className="text-gray-500 text-center max-w-md">
            {t("cart.loginDescription")}
          </p>
          <Button onClick={() => signIn("openiddict")} className="mt-4">
            {t("cart.loginButton")}
          </Button>
        </div>
      </div>
    );
  }

  if (isLoadingCart) {
    return <CartSkeleton />;
  }

  if (isCartEmpty) {
    return <EmptyCart />; 
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{t("cart.title")}</h2>
          <p className="text-gray-600 mt-1">
            {totalItems} {t("cart.items")} - {t("cart.total")} ₺{formatPrice(totalAmount)}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={clearCart}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          {t("cart.clear")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart?.items && cart.items.length > 0 ? (
            cart.items.map((item) => (
              <div key={item.id}>
                <CartItem item={item} />
                <Separator className="mt-4" />
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">{t("cart.empty")}</p>
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <CartSummary 
              totalItems={totalItems}
              totalAmount={totalAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 