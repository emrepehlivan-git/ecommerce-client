import { create } from "zustand";
import {
  useGetApiV1Cart,
  usePostApiV1CartAdd,
  usePutApiV1CartUpdateQuantity,
  useDeleteApiV1CartRemoveProductId,
  useDeleteApiV1CartClear,
} from "@/api/generated/cart/cart";
import { CartDto, AddToCartCommand, UpdateCartItemQuantityCommand } from "@/api/generated/model";
import { useErrorHandler } from "@/hooks/use-error-handling";
import { Session } from "next-auth";
import React, { useCallback } from "react";

interface UserData {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  roles?: string[] | null;
  [key: string]: any;
}

interface UserState {
  user: UserData | null;
}

interface CartState {
  cart: CartDto | undefined;
  isLoadingCart: boolean;
  errorCart: Error | null;
  totalItems: number;
  totalAmount: number;
  isCartEmpty: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refetchCart: () => void;
}

type AppState = UserState & CartState;

export const useAppStore = create<AppState>(() => ({
  user: null,
  cart: undefined,
  isLoadingCart: true,
  errorCart: null,
  totalItems: 0,
  totalAmount: 0,
  isCartEmpty: true,
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  refetchCart: () => {},
}));

let storeInitialized = false;

export const initializeStore = (userInfo: UserData | null) => {
  if (!storeInitialized) {
    useAppStore.setState({ user: userInfo });
    storeInitialized = true;
  }
};

export const useInitializeCart = (session: Session | null) => {
    const { handleError, handleSuccess } = useErrorHandler({ context: "CartStore" });

    const { data: cartResponse, isLoading, error, refetch } = useGetApiV1Cart({
        query: { enabled: !!session?.user?.id, },
    });

    const cart = cartResponse as CartDto | undefined;
    const totalItems = cart?.totalItems || 0;
    const totalAmount = cart?.totalAmount || 0;
    const isCartEmpty = !cart?.items || cart.items.length === 0;
    
    const addToCartMutation = usePostApiV1CartAdd({
        mutation: {
            onSuccess: () => { handleSuccess("Ürün sepete eklendi!"); refetch(); },
            onError: (error) => { handleError(error); },
        },
    });

    const updateQuantityMutation = usePutApiV1CartUpdateQuantity({
        mutation: {
            onSuccess: () => { handleSuccess("Miktar güncellendi!"); refetch(); },
            onError: (error) => { handleError(error); },
        },
    });

    const removeFromCartMutation = useDeleteApiV1CartRemoveProductId({
        mutation: {
            onSuccess: () => { handleSuccess("Ürün sepetten çıkarıldı!"); refetch(); },
            onError: (error) => { handleError(error); },
        },
    });

    const clearCartMutation = useDeleteApiV1CartClear({
        mutation: {
            onSuccess: () => { 
                handleSuccess("Sepet temizlendi!"); 
                useAppStore.setState({
                    cart: undefined,
                    totalItems: 0,
                    totalAmount: 0,
                    isCartEmpty: true,
                });
                refetch(); 
            },
            onError: (error) => { handleError(error); },
        },
    });

    const addToCart = useCallback(async (productId: string, quantity: number) => {
        const command: AddToCartCommand = { productId, quantity };
        await addToCartMutation.mutateAsync({ data: command });
    }, [addToCartMutation]);

    const updateQuantity = useCallback(async (productId: string, quantity: number) => {
        const command: UpdateCartItemQuantityCommand = { productId, quantity };
        await updateQuantityMutation.mutateAsync({ data: command });
    }, [updateQuantityMutation]);

    const removeFromCart = useCallback(async (productId: string) => {
        await removeFromCartMutation.mutateAsync({ productId });
    }, [removeFromCartMutation]);

    const clearCart = useCallback(async () => {
        await clearCartMutation.mutateAsync();
    }, [clearCartMutation]);

    React.useEffect(() => {
        useAppStore.setState({
            cart: cart,
            isLoadingCart: isLoading,
            errorCart: error as Error | null,
            totalItems,
            totalAmount,
            isCartEmpty,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            refetchCart: refetch,
        });
    }, [cart, isLoading, error, totalItems, totalAmount, isCartEmpty, refetch, addToCart, updateQuantity, removeFromCart, clearCart]);

}; 