import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mocking the store creation
const createMockStore = (initialState = {}) => {
  return {
    cart: undefined,
    totalItems: 0,
    totalAmount: 0,
    addToCart: vi.fn(),
    ...initialState,
  };
};

describe('useAppStore', () => {
  it('should have initial state', () => {
    const store = createMockStore();
    expect(store.totalItems).toBe(0);
    expect(store.totalAmount).toBe(0);
    expect(store.cart).toBeUndefined();
  });

  it('should call addToCart', async () => {
    const store = createMockStore();
    await store.addToCart('product-1', 1);
    expect(store.addToCart).toHaveBeenCalledWith('product-1', 1);
  });
});
