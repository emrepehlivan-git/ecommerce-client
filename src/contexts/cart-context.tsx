"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { 
  useGetApiCart, 
  usePostApiCartAdd, 
  usePutApiCartUpdateQuantity, 
  useDeleteApiCartRemoveProductId,
  useDeleteApiCartClear
} from '@/api/generated/cart/cart';
import { CartDto, AddToCartCommand, UpdateCartItemQuantityCommand } from '@/api/generated/model';
import { useErrorHandler } from '@/lib/hooks/useErrorHandler';

interface CartContextType {
  // Data
  cart: CartDto | undefined;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Computed values
  totalItems: number;
  totalAmount: number;
  isCartEmpty: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  // Error handler
  const { handleError, handleSuccess } = useErrorHandler({
    context: 'CartProvider'
  });

  // Fetch cart data
  const { data: cartResponse, isLoading, error, refetch } = useGetApiCart();
  const cart = cartResponse as CartDto | undefined;
  
  // Mutations
  const addToCartMutation = usePostApiCartAdd({
    mutation: {
      onSuccess: () => {
        handleSuccess('Ürün sepete eklendi!');
        refetch();
      },
      onError: (error) => {
        handleError(error, 'Ürün sepete eklenirken hata oluştu!');
      }
    }
  });

  const updateQuantityMutation = usePutApiCartUpdateQuantity({
    mutation: {
      onSuccess: () => {
        handleSuccess('Miktar güncellendi!');
        refetch();
      },
      onError: (error) => {
        handleError(error, 'Miktar güncellenirken hata oluştu!');
      }
    }
  });

  const removeFromCartMutation = useDeleteApiCartRemoveProductId({
    mutation: {
      onSuccess: () => {
        handleSuccess('Ürün sepetten çıkarıldı!');
        refetch();
      },
      onError: (error) => {
        handleError(error, 'Ürün sepetten çıkarılırken hata oluştu!');
      }
    }
  });

  const clearCartMutation = useDeleteApiCartClear({
    mutation: {
      onSuccess: () => {
        handleSuccess('Sepet temizlendi!');
        refetch();
      },
      onError: (error) => {
        handleError(error, 'Sepet temizlenirken hata oluştu!');
      }
    }
  });

  // Actions
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

  // Computed values
  const totalItems = cart?.totalItems || 0;
  const totalAmount = cart?.totalAmount || 0;
  const isCartEmpty = !cart?.items || cart.items.length === 0;

  const value: CartContextType = {
    // Data
    cart,
    isLoading,
    error: error as Error | null,
    
    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    
    // Computed values
    totalItems,
    totalAmount,
    isCartEmpty
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
} 