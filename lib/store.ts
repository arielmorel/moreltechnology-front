import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSyncExternalStore } from 'react';
import { Product, ProductVariant } from './data';
import { getCartItemId, resolveProductPrice } from './product-pricing';

export interface CartItem extends Product {
  quantity: number;
  cartItemId?: string;
  variantId?: string;
  variantName?: string;
}

interface CartStore {
  items: CartItem[];
  compareItems: Product[];
  addItem: (product: Product, variant?: ProductVariant) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
}

function itemKey(item: CartItem): string {
  return item.cartItemId ?? item.id;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      compareItems: [],
      addItem: (product, variant) => {
        const currentItems = get().items;
        const cartItemId = getCartItemId(product.id, variant?.id);
        const existingItem = currentItems.find((item) => itemKey(item) === cartItemId);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              itemKey(item) === cartItemId
                ? { ...item, cartItemId, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          const pricing = resolveProductPrice(product, variant);
          const cartProduct: Product = variant
            ? {
                ...product,
                sku: variant.sku || product.sku,
                price: pricing.price,
                originalPrice: pricing.originalPrice,
                prices: variant.prices.length > 0 ? variant.prices : product.prices,
              }
            : product;

          set({
            items: [
              ...currentItems,
              {
                ...cartProduct,
                quantity: 1,
                cartItemId,
                variantId: variant?.id,
                variantName: variant?.name,
              },
            ],
          });
        }
      },
      removeItem: (cartItemId) => {
        set({
          items: get().items.filter((item) => itemKey(item) !== cartItemId),
        });
      },
      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set({
          items: get().items.map((item) =>
            itemKey(item) === cartItemId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
      
      addToCompare: (product) => {
        const currentCompare = get().compareItems;
        if (currentCompare.find(item => item.id === product.id)) return;
        if (currentCompare.length >= 3) {
          return;
        }
        set({ compareItems: [...currentCompare, product] });
      },
      removeFromCompare: (productId) => {
        set({
          compareItems: get().compareItems.filter(item => item.id !== productId)
        });
      },
      clearCompare: () => set({ compareItems: [] })
    }),
    {
      name: 'morel-cart-storage',
    }
  )
);

function subscribeToHydration(callback: () => void) {
  const unsubscribe = useCart.persist.onFinishHydration(callback);
  return unsubscribe;
}

export function useCartHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToHydration,
    () => useCart.persist.hasHydrated(),
    () => false
  );
}
