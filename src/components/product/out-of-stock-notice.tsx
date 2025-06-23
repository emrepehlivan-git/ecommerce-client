import { Card, CardContent } from "@/components/ui/card";

export function OutOfStockNotice() {
  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-6 text-center">
        <p className="text-orange-800 font-medium">
          Bu ürün şu anda stokta bulunmamaktadır.
        </p>
        <p className="text-orange-600 text-sm mt-1">
          Stok durumu hakkında güncellemeler almak için bizi takip edin.
        </p>
      </CardContent>
    </Card>
  );
} 