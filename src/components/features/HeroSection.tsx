'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getGreeting } from '@/lib/utils';
import { useThemeStore } from '@/lib/store/useThemeStore';

export function HeroSection() {
    const [greeting, setGreeting] = useState({ greeting: 'Pagi', isNight: false });
    const { initializeTheme } = useThemeStore();

    useEffect(() => {
        setGreeting(getGreeting());
        initializeTheme();
    }, [initializeTheme]);

    return (
        <header className="pt-28 px-4 md:px-6 pb-8 relative max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 mb-3"
            >
                <div className="w-2 h-2 rounded-full bg-accent pulse-indicator" />
                <span className="text-[10px] uppercase tracking-widest font-semibold opacity-60">
                    Open 24 Jam • Sidoarjo
                </span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-4xl md:text-6xl leading-tight mb-4"
            >
                Selamat <span className="italic text-accent">{greeting.greeting}</span>,<br />Khaleed.
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
            >
                <p className="text-sm leading-relaxed opacity-70 mb-6 pr-20">
                    Kopi berkualitas untuk harimu.
                </p>
            </motion.div>
        </header>
    );
}

interface CategoryScrollProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export function CategoryScroll({ categories, activeCategory, onCategoryChange }: CategoryScrollProps) {
    return (
        <section className="px-4 md:px-6 mt-6 overflow-x-auto no-scrollbar mask-fade-right -mx-4 md:mx-0">
            <div className="flex gap-3 md:gap-8 items-center whitespace-nowrap px-4 md:px-0 pb-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`
                            font-serif text-base md:text-2xl transition-all duration-300 py-2 px-1 touch-manipulation
                            ${activeCategory === category
                                ? 'text-2xl md:text-3xl font-bold border-b-2 border-accent'
                                : 'text-lg md:text-2xl opacity-40 hover:opacity-100'}
                        `}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </section>
    );
}
