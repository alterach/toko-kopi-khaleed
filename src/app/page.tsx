'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar, CartBubble, Footer } from '@/components/layout';
import { HeroSection, CategoryScroll } from '@/components/features/HeroSection';
import { ProductGrid } from '@/components/features/ProductCard';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { supabase } from '@/lib/supabase/client';
import { Product, CATEGORY_LABELS } from '@/lib/supabase/types';

const CATEGORIES = ['coffee', 'non-coffee', 'heavy-meal', 'snack'] as const;
const CATEGORY_DISPLAY = ['Coffee', 'Non-Coffee', 'Meals', 'Snacks'];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>('coffee');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { initializeTheme } = useThemeStore();

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

  const filteredProducts = products.filter(
    (product) => product.category === activeCategory
  );

  // Transform for ProductCard component
  const displayProducts = filteredProducts.map((p) => ({
    id: String(p.id),
    name: p.name,
    price: p.price,
    category: CATEGORY_LABELS[p.category],
    description: p.description || undefined,
    image: p.image_url || '',
    isAvailable: p.is_available,
  }));

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
        categories={CATEGORY_DISPLAY}
        activeCategory={CATEGORY_LABELS[activeCategory as keyof typeof CATEGORY_LABELS] || 'Coffee'}
        onCategoryChange={(display) => {
          // Find the key for this display value
          const key = Object.entries(CATEGORY_LABELS).find(
            ([, value]) => value === display
          )?.[0] || 'coffee';
          setActiveCategory(key);
        }}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <ProductGrid key={activeCategory} products={displayProducts} />
        </AnimatePresence>
      )}

      <CartBubble />

      <Footer />
    </>
  );
}
