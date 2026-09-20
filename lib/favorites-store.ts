import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './data';

interface FavoritesStore {
  items: Product[];
  toggleFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavorites = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleFavorite: (product) => {
        const { items } = get();
        const exists = items.some((item) => item.id === product.id);
        set({
          items: exists
            ? items.filter((item) => item.id !== product.id)
            : [...items, product],
        });
      },
      removeFavorite: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },
      isFavorite: (productId) => get().items.some((item) => item.id === productId),
      clearFavorites: () => set({ items: [] }),
    }),
    {
      name: 'morel-favorites-storage',
    }
  )
);