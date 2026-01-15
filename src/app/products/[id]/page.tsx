'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar, Footer } from '@/components/layout';
import { CartPanel } from '@/components/features/CartPanel';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { supabase } from '@/lib/supabase/client';
import { Product, CATEGORY_LABELS } from '@/lib/supabase/types';
import { formatRupiah } from '@/lib/utils';
import { ProductDetailSkeleton } from '@/components/features/Skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { initializeTheme } = useThemeStore();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);

  useEffect(() => {
    setMounted(true);
    initializeTheme();
    fetchProduct();
  }, [initializeTheme, params.id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', Number(params.id))
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image_url || '',
      notes: notes || undefined,
    });

    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2000);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-32 px-6 pb-24 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <ProductDetailSkeleton />
          </div>
        </main>
<CartPanel />
      </>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <>
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-32 px-6 pb-24 min-h-screen"
      >
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-8 opacity-60 hover:opacity-100 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-semibold">BACK</span>
          </button>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square bg-card rounded-3xl overflow-hidden"
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-30">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {!product.is_available && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-serif text-2xl">SOLD OUT</span>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold opacity-50 mb-2 block">
                  {CATEGORY_LABELS[product.category]}
                </span>
                <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-4">
                  {product.name}
                </h1>
                <p className="text-accent font-bold text-2xl">
                  {formatRupiah(product.price)}
                </p>
              </div>

              {product.description && (
                <p className="text-sm leading-relaxed opacity-70">
                  {product.description}
                </p>
              )}

              {product.is_available && (
                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold opacity-60">QUANTITY</span>
                    <div className="flex items-center gap-3 glass rounded-full px-4 py-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-8 text-center font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold opacity-60 mb-2 block">
                      SPECIAL INSTRUCTIONS
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Less sugar, extra ice, etc."
                      className="w-full glass rounded-2xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/20"
                      rows={3}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="w-full bg-text text-bg py-4 rounded-full font-bold tracking-widest text-sm hover:shadow-lg transition-all"
                  >
                    ADD TO CART • {formatRupiah(product.price * quantity)}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24"
        >
          <h2 className="font-serif text-2xl mb-8 text-center">You Might Also Like</h2>
          <p className="text-center opacity-50 text-sm">Related products coming soon...</p>
        </motion.div>
      </motion.main>

      <CartPanel />

      <Footer />

      <AnimatePresence>
        {showAddedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] glass px-6 py-4 rounded-full shadow-2xl flex items-center gap-3"
          >
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold text-sm">Added to cart!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
