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
        <header className="pt-32 px-6 pb-12 relative max-w-6xl mx-auto">
            {/* Open 24H Badge */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 mb-4"
            >
                <div className="w-2 h-2 rounded-full bg-accent pulse-indicator" />
                <span className="text-[10px] uppercase tracking-widest font-semibold opacity-60">
                    Open 24 Hours • Sidoarjo
                </span>
            </motion.div>

            {/* Dynamic Greeting */}
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-5xl md:text-6xl leading-[1.1] mb-6"
            >
                Selamat <br />
                <span className="italic text-accent">{greeting.greeting}</span>, Khaleed.
            </motion.h1>

            {/* Hero Content */}
            <div className="relative flex items-end justify-between mt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-1/2"
                >
                    <p className="text-sm leading-relaxed opacity-70">
                        Timeless fluidity in every drop. Crafting moments for the thinkers, rushers, and dreamers.
                    </p>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="w-2/5 aspect-[3/4] product-clip bg-card overflow-hidden shadow-2xl relative translate-y-4"
                >
                    <img
                        src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800"
                        alt="Khaleed Coffee"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                </motion.div>
            </div>
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
        <section className="px-6 mt-12 overflow-x-auto no-scrollbar mask-fade-right">
            <div className="flex gap-8 items-end whitespace-nowrap pb-4">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`
              font-serif transition-all duration-300
              ${activeCategory === category
                                ? 'text-3xl font-bold border-b-2 border-accent'
                                : 'text-2xl opacity-40 hover:opacity-100'}
            `}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </section>
    );
}
