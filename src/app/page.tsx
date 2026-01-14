'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar, CartBubble, Footer } from '@/components/layout';
import { HeroSection, CategoryScroll } from '@/components/features/HeroSection';
import { ProductGrid, Product } from '@/components/features/ProductCard';
import { useThemeStore } from '@/lib/store/useThemeStore';

// Mock data - akan diganti dengan Supabase nanti
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Manuka Latte',
    price: 48000,
    category: 'Coffee',
    description: 'Signature latte with Manuka honey',
    image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Cold Brew',
    price: 52000,
    category: 'Coffee',
    description: '24-hour slow brew, smooth and bold',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Truffle Fries',
    price: 65000,
    category: 'Snacks',
    description: 'Crispy fries with truffle oil',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Matcha Oat',
    price: 45000,
    category: 'Non-Coffee',
    description: 'Premium matcha with oat milk',
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Nasi Gila',
    price: 55000,
    category: 'Meals',
    description: 'Spicy fried rice with all the toppings',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
  },
];

const CATEGORIES = ['Coffee', 'Non-Coffee', 'Meals', 'Snacks'];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('Coffee');
  const [mounted, setMounted] = useState(false);
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    setMounted(true);
    initializeTheme();
  }, [initializeTheme]);

  const filteredProducts = MOCK_PRODUCTS.filter(
    (product) => product.category === activeCategory
  );

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <HeroSection />

      <CategoryScroll
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <AnimatePresence mode="wait">
        <ProductGrid key={activeCategory} products={filteredProducts} />
      </AnimatePresence>

      <CartBubble />

      <Footer />
    </>
  );
}
