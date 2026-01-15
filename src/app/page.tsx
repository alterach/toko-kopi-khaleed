'use client';

import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar, CartBubble, Footer } from '@/components/layout';
import { HeroSection, CategoryScroll } from '@/components/features/HeroSection';
import { ProductGrid } from '@/components/features/ProductCard';
import { ProductGridSkeleton } from '@/components/features/Skeleton';
import { EmptyCartState } from '@/components/features/EmptyCartState';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { supabase } from '@/lib/supabase/client';
import { Product, CATEGORY_LABELS } from '@/lib/supabase/types';

const CATEGORIES = ['coffee', 'non-coffee', 'heavy-meal', 'snack'] as const;
const CATEGORY_DISPLAY = ['Coffee', 'Non-Coffee', 'Meals', 'Snacks'];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>('coffee');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { initializeTheme } = useThemeStore();
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
    initializeTheme();
    fetchProducts();
  }, [initializeTheme]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    return result;
  }, [products, activeCategory, searchQuery]);

  const displayProducts = filteredProducts.map((p) => ({
    id: String(p.id),
    name: p.name,
    price: p.price,
    category: CATEGORY_LABELS[p.category],
    description: p.description || undefined,
    image: p.image_url || '',
    isAvailable: p.is_available,
  }));

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar onSearch={handleSearch} />

      <HeroSection />

      <CategoryScroll
        categories={CATEGORY_DISPLAY}
        activeCategory={CATEGORY_LABELS[activeCategory as keyof typeof CATEGORY_LABELS] || 'Coffee'}
        onCategoryChange={(display) => {
          const key = Object.entries(CATEGORY_LABELS).find(
            ([, value]) => value === display
          )?.[0] || 'coffee';
          setActiveCategory(key);
        }}
      />

      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : displayProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg className="w-16 h-16 opacity-40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-lg opacity-60 mb-2">No products found</p>
          <p className="text-sm opacity-40">
            {searchQuery ? `No results for "${searchQuery}"` : 'No products in this category'}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <ProductGrid key={`${activeCategory}-${searchQuery}`} products={displayProducts} />
        </AnimatePresence>
      )}

      <CartBubble />

      {cartItems.length === 0 && <EmptyCartState />}

      <Footer />
    </>
  );
}
