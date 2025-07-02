"use client";

import React, { createContext, useContext, ReactNode } from "react";
import {
  useGetApiV1Cart,
  usePostApiV1CartAdd,
  usePutApiV1CartUpdateQuantity,
  useDeleteApiV1CartRemoveProductId,
  useDeleteApiV1CartClear,
} from "@/api/generated/cart/cart";
import { CartDto, AddToCartCommand, UpdateCartItemQuantityCommand } from "@/api/generated/model";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";
import { useSession } from "next-auth/react";

interface CartContextType {
  cart: CartDto | undefined;
  isLoading: boolean;
  error: Error | null;

  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  totalItems: number;
  totalAmount: number;
  isCartEmpty: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { handleError, handleSuccess } = useErrorHandler({
    context: "CartProvider",
  });

  const { data: user } = useSession();

  const {
    data: cartResponse,
    isLoading,
    error,
    refetch,
  } = useGetApiV1Cart({
    query: {
      enabled: !!user?.user?.id,
    },
  });

  const cart = cartResponse?.data as CartDto | undefined;

  const addToCartMutation = usePostApiV1CartAdd({
    mutation: {
      onSuccess: () => {
        handleSuccess("Ürün sepete eklendi!");
        refetch();
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  const updateQuantityMutation = usePutApiV1CartUpdateQuantity({
    mutation: {
      onSuccess: () => {
        handleSuccess("Miktar güncellendi!");
        refetch();
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  const removeFromCartMutation = useDeleteApiV1CartRemoveProductId({
    mutation: {
      onSuccess: () => {
        handleSuccess("Ürün sepetten çıkarıldı!");
        refetch();
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  const clearCartMutation = useDeleteApiV1CartClear({
    mutation: {
      onSuccess: () => {
        handleSuccess("Sepet temizlendi!");
        refetch();
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  const addToCart = async (productId: string, quantity: number) => {
    const command: AddToCartCommand = { productId, quantity };
    await addToCartMutation.mutateAsync({ data: command });
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const command: UpdateCartItemQuantityCommand = { productId, quantity };
    await updateQuantityMutation.mutateAsync({ data: command });
  };

  const removeFromCart = async (productId: string) => {
    await removeFromCartMutation.mutateAsync({ productId });
  };

  const clearCart = async () => {
    await clearCartMutation.mutateAsync();
  };

  const totalItems = cart?.totalItems || 0;
  const totalAmount = cart?.totalAmount || 0;
  const isCartEmpty = !cart?.items || cart.items.length === 0;

  const value: CartContextType = {
    cart,
    isLoading,
    error: error as Error | null,

    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,

    totalItems,
    totalAmount,
    isCartEmpty,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
