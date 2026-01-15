'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { formatRupiah } from '@/lib/utils';
import { SearchBar } from '@/components/features/SearchBar';

interface NavbarProps {
    onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const { isDarkMode, toggleTheme } = useThemeStore();
    const totalItems = useCartStore((state) => state.getTotalItems());
    const totalPrice = useCartStore((state) => state.getTotalPrice());

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isSearchExpanded && searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchExpanded(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSearchExpanded]);

    const handleSearch = (query: string) => {
        onSearch?.(query);
    };

    return (
        <nav ref={searchRef} className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[400px]">
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`
          glass px-6 py-4 rounded-full flex items-center justify-between shadow-lg
          transition-all duration-300
          ${isScrolled ? 'py-3 shadow-xl' : ''}
        `}
            >
                <SearchBar
                    onSearch={handleSearch}
                    isExpanded={isSearchExpanded}
                    onToggle={() => setIsSearchExpanded(!isSearchExpanded)}
                />

                <AnimatePresence mode="wait">
                    {!isSearchExpanded && (
                        <motion.a
                            href="/"
                            key="logo"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="font-serif text-lg font-bold tracking-tight absolute left-1/2 -translate-x-1/2"
                        >
                            KHALEED
                        </motion.a>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center p-1 transition-transform hover:scale-110"
                        aria-label={isDarkMode ? 'Switch to day mode' : 'Switch to night mode'}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isDarkMode ? 'moon' : 'sun'}
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isDarkMode ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </button>

                    <a href="/login" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">
                        LOGIN
                    </a>
                </div>
            </motion.div>
        </nav>
    );
}

export function CartBubble() {
    const totalItems = useCartStore((state) => state.getTotalItems());
    const totalPrice = useCartStore((state) => state.getTotalPrice());

    if (totalItems === 0) return null;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]"
        >
            <button className="bg-text text-bg px-8 py-5 rounded-full shadow-2xl flex items-center gap-4 hover:scale-105 transition-transform">
                <div className="relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="absolute -top-2 -right-2 bg-accent text-bg text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {totalItems}
                    </span>
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60 mb-1">
                        Review Order
                    </span>
                    <span className="font-serif text-lg">{formatRupiah(totalPrice)}</span>
                </div>
            </button>
        </motion.div>
    );
}

export function Footer() {
    return (
        <footer className="px-6 py-20 mt-12 bg-black/5">
            <div className="flex justify-between items-start max-w-6xl mx-auto">
                <div>
                    <h2 className="font-serif text-4xl mb-4">
                        Stay Late,<br />Stay Inspired.
                    </h2>
                    <p className="opacity-50 text-xs uppercase tracking-widest font-bold">
                        Khaleed × Coffee 2024
                    </p>
                </div>
                <div className="flex flex-col gap-4 text-right">
                    <a href="https://instagram.com/tokokopikhaleed" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                        Instagram
                    </a>
                    <a href="https://maps.google.com/?q=Jl.+Raden+Patah+No.33,+Sidoarjo" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                        Location
                    </a>
                    <a href="/faq" className="opacity-60 hover:opacity-100 transition-opacity">
                        FAQ
                    </a>
                </div>
            </div>
        </footer>
    );
}
