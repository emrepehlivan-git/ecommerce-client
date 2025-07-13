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
import React from "react";

// User State and Actions
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

// Cart State and Actions
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

// Combined Store
type AppState = UserState & CartState;

export const useAppStore = create<AppState>((set, get) => ({
  // User initial state and actions
  user: null,

  // Cart initial state and actions
  cart: undefined,
  isLoadingCart: true,
  errorCart: null,
  totalItems: 0,
  totalAmount: 0,
  isCartEmpty: true,
  refetchCart: () => {},

  addToCart: async (productId, quantity) => {
    console.log("addToCart called with", { productId, quantity });
  },
  updateQuantity: async (productId, quantity) => {
    console.log("updateQuantity called with", { productId, quantity });
  },
  removeFromCart: async (productId) => {
    console.log("removeFromCart called with", { productId });
  },
  clearCart: async () => {
    console.log("clearCart called");
  },
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
            onSuccess: () => { handleSuccess("Sepet temizlendi!"); refetch(); },
            onError: (error) => { handleError(error); },
        },
    });

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
    }, [cart, isLoading, error, totalItems, totalAmount, isCartEmpty, refetch]);

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

}; 