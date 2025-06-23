"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, CreditCard } from "lucide-react";
import Link from "next/link";

interface CartSummaryProps {
  totalItems: number;
  totalAmount: number;
}

export function CartSummary({ totalItems, totalAmount }: CartSummaryProps) {
  const shippingCost = totalAmount > 500 ? 0 : 29.99;
  const finalTotal = totalAmount + shippingCost;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Sipariş Özeti
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Ürün Sayısı:</span>
            <span>{totalItems} adet</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Ara Toplam:</span>
            <span>₺{totalAmount.toLocaleString('tr-TR')}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Kargo Ücreti:</span>
            <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
              {shippingCost === 0 ? "Ücretsiz" : `₺${shippingCost.toLocaleString('tr-TR')}`}
            </span>
          </div>
          
          {totalAmount < 500 && (
            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
              ₺{(500 - totalAmount).toLocaleString('tr-TR')} daha alışveriş yapın, kargo ücretsiz olsun!
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Toplam:</span>
          <span className="text-primary">₺{finalTotal.toLocaleString('tr-TR')}</span>
        </div>

        <div className="space-y-3 pt-4">
          <Button asChild className="w-full h-12 text-lg">
            <Link href="/odeme">
              <CreditCard className="mr-2 h-5 w-5" />
              Ödemeye Geç
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/products">
              Alışverişe Devam Et
            </Link>
          </Button>
        </div>

        <div className="pt-4 space-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Güvenli ödeme</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Ücretsiz iade</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Hızlı teslimat</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 