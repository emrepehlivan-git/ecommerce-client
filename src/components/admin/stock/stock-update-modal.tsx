"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Package, Minus, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { usePutApiV1ProductIdStock } from "@/api/generated/product/product";
import type { ProductDto } from "@/api/generated/model";
import { useErrorHandler } from "@/hooks/use-error-handling";
import { useI18n } from "@/i18n/client";

const stockUpdateSchema = z.object({
  stockQuantity: z.number().min(0, "Stock quantity must be 0 or greater"),
});

type StockUpdateForm = z.infer<typeof stockUpdateSchema>;

interface StockUpdateModalProps {
  product: ProductDto | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StockUpdateModal({ product, isOpen, onClose, onSuccess }: StockUpdateModalProps) {
  const [adjustmentMode, setAdjustmentMode] = useState<"set" | "adjust">("set");
  const { handleError } = useErrorHandler();
  const t = useI18n();

  const form = useForm<StockUpdateForm>({
    resolver: zodResolver(stockUpdateSchema),
    defaultValues: {
      stockQuantity: 0,
    },
  });

  const stockMutation = usePutApiV1ProductIdStock({
    mutation: {
      onSuccess: () => {
        onSuccess();
        form.reset();
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  useEffect(() => {
    if (product) {
      form.setValue("stockQuantity", product.stockQuantity || 0);
      setAdjustmentMode("set");
    }
  }, [product, form]);

  const handleSubmit = (data: StockUpdateForm) => {
    if (!product?.id) return;

    let newStock = data.stockQuantity;
    if (adjustmentMode === "adjust") {
      newStock = (product.stockQuantity || 0) + data.stockQuantity;
      newStock = Math.max(0, newStock); // Ensure non-negative
    }

    stockMutation.mutate({
      id: product.id,
      data: {
        productId: product.id,
        stockQuantity: newStock,
      },
    });
  };

  const handleQuickAdjust = (amount: number) => {
    const currentValue = form.getValues("stockQuantity");
    let newValue: number;
    
    if (adjustmentMode === "adjust") {
      newValue = currentValue + amount;
    } else {
      newValue = (product?.stockQuantity || 0) + amount;
    }
    
    newValue = Math.max(0, newValue);
    form.setValue("stockQuantity", newValue);
  };

  const currentStock = product?.stockQuantity || 0;
  const formValue = form.watch("stockQuantity");
  const finalStock = adjustmentMode === "adjust" ? Math.max(0, currentStock + formValue) : formValue;

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { variant: "destructive" as const, key: "outOfStockStatus" };
    if (quantity <= 10) return { variant: "warning" as const, key: "lowStockStatus" };
    return { variant: "success" as const, key: "inStock" };
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t("admin.stock.updateStock")}
          </DialogTitle>
          <DialogDescription>
            {t("admin.stock.updateStockDesc", { 0: product?.name ?? "" })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <Label className="text-sm font-medium">{t("admin.stock.currentStock")}</Label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold">{currentStock}</span>
                <Badge variant={getStockStatus(currentStock).variant}>
                  {getStockStatus(currentStock).key === "inStock" && t("admin.stock.inStock")}
                  {getStockStatus(currentStock).key === "lowStockStatus" && t("admin.stock.lowStockStatus")}
                  {getStockStatus(currentStock).key === "outOfStockStatus" && t("admin.stock.outOfStockStatus")}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <Label className="text-sm font-medium">{t("admin.stock.unitPrice")}</Label>
              <div className="text-lg font-semibold">₺{product?.price?.toLocaleString("tr-TR")}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant={adjustmentMode === "set" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setAdjustmentMode("set");
                form.setValue("stockQuantity", currentStock);
              }}
            >
              {t("admin.stock.setAmount")}
            </Button>
            <Button
              type="button"
              variant={adjustmentMode === "adjust" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setAdjustmentMode("adjust");
                form.setValue("stockQuantity", 0);
              }}
            >
              {t("admin.stock.adjustAmount")}
            </Button>
          </div>

          <Separator />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="stockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {adjustmentMode === "set"
                        ? t("admin.stock.newStockQuantity")
                        : t("admin.stock.adjustmentAmount")}
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAdjust(-1)}
                          disabled={adjustmentMode === "set" && formValue <= 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          {...field}
                          type="number"
                          min={adjustmentMode === "set" ? 0 : undefined}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="text-center"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAdjust(1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap gap-2">
                {adjustmentMode === "adjust" ? (
                  <>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleQuickAdjust(-10)}>-10</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleQuickAdjust(-5)}>-5</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleQuickAdjust(5)}>+5</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleQuickAdjust(10)}>+10</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleQuickAdjust(50)}>+50</Button>
                  </>
                ) : (
                  <>
                    <Button type="button" variant="outline" size="sm" onClick={() => form.setValue("stockQuantity", 0)}>0</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => form.setValue("stockQuantity", 10)}>10</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => form.setValue("stockQuantity", 25)}>25</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => form.setValue("stockQuantity", 50)}>50</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => form.setValue("stockQuantity", 100)}>100</Button>
                  </>
                )}
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <Label className="text-sm font-medium">{t("admin.stock.finalStockAmount")}</Label>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{finalStock}</span>
                    <Badge variant={getStockStatus(finalStock).variant}>
                      {getStockStatus(finalStock).key === "inStock" && t("admin.stock.inStock")}
                      {getStockStatus(finalStock).key === "lowStockStatus" && t("admin.stock.lowStockStatus")}
                      {getStockStatus(finalStock).key === "outOfStockStatus" && t("admin.stock.outOfStockStatus")}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">{t("admin.stock.stockValue")}</div>
                    <div className="font-semibold">
                      ₺{(finalStock * (product?.price || 0)).toLocaleString("tr-TR")}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={stockMutation.isPending}>
                  {stockMutation.isPending ? t("admin.stock.updating") : t("admin.stock.updateStock")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}