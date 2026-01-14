'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
    isDarkMode: boolean;
    toggleTheme: () => void;
    setTheme: (dark: boolean) => void;
    initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            isDarkMode: false,

            toggleTheme: () => {
                const newValue = !get().isDarkMode;
                set({ isDarkMode: newValue });

                if (typeof document !== 'undefined') {
                    document.body.classList.toggle('dark-mode', newValue);
                }
            },

            setTheme: (dark: boolean) => {
                set({ isDarkMode: dark });
                if (typeof document !== 'undefined') {
                    document.body.classList.toggle('dark-mode', dark);
                }
            },

            initializeTheme: () => {
                // Auto-set theme based on time of day (18:00 - 05:59 = night)
                const hour = new Date().getHours();
                const isNightTime = hour >= 18 || hour < 6;

                // Check persisted value first, fallback to time-based
                const currentState = get().isDarkMode;
                const shouldBeDark = currentState || isNightTime;

                if (typeof document !== 'undefined') {
                    document.body.classList.toggle('dark-mode', shouldBeDark);
                }
                set({ isDarkMode: shouldBeDark });
            },
        }),
        {
            name: 'khaleed-theme',
        }
    )
);
