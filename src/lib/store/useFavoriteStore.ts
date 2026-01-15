'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteState {
    favorites: string[];
    toggleFavorite: (productId: string) => void;
    isFavorite: (productId: string) => boolean;
    clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
    persist(
        (set, get) => ({
            favorites: [],

            toggleFavorite: (productId) => {
                const isFav = get().favorites.includes(productId);
                if (isFav) {
                    set({
                        favorites: get().favorites.filter((id) => id !== productId),
                    });
                } else {
                    set({
                        favorites: [...get().favorites, productId],
                    });
                }
            },

            isFavorite: (productId) => {
                return get().favorites.includes(productId);
            },

            clearFavorites: () => {
                set({ favorites: [] });
            },
        }),
        {
            name: 'khaleed-favorites',
        }
    )
);
