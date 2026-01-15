'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/store/useCartStore';
import { useFavoriteStore } from '@/lib/store/useFavoriteStore';
import { formatRupiah } from '@/lib/utils';

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    description?: string;
    image: string;
    isAvailable: boolean;
}

interface ProductCardProps {
    product: Product;
    index: number;
    reversed?: boolean;
}

export function ProductCard({ product, index, reversed = false }: ProductCardProps) {
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);
    const { toggleFavorite, isFavorite } = useFavoriteStore();
    const [isFav, setIsFav] = useState(isFavorite(product.id));

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
        });
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(product.id);
        setIsFav(!isFav);
    };

    const handleCardClick = () => {
        if (product.isAvailable) {
            router.push(`/products/${product.id}`);
        }
    };

    const containerClass = reversed
        ? 'flex flex-row-reverse items-center justify-between'
        : 'flex items-center justify-between';

    const textAlign = reversed ? 'text-right' : 'text-left';
    const bgPosition = reversed ? 'left-0' : 'right-0';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className={`product-card group relative ${containerClass} ${product.isAvailable ? 'cursor-pointer' : ''}`}
            onClick={handleCardClick}
        >
            <div className={`w-1/2 z-10 ${textAlign}`}>
                <h3 className="font-serif text-3xl mb-1">{product.name}</h3>
                <p className="text-accent font-semibold mb-4">{formatRupiah(product.price)}</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToCart}
                    disabled={!product.isAvailable}
                    className={`
            px-6 py-3 bg-text text-bg rounded-full text-xs font-bold tracking-widest
            transition-all duration-300
            ${product.isAvailable
                            ? 'hover:shadow-lg'
                            : 'opacity-50 cursor-not-allowed'}
          `}
                >
                    {product.isAvailable ? 'QUICK ADD +' : 'SOLD OUT'}
                </motion.button>
            </div>

            <div
                className={`
          absolute ${bgPosition} w-3/5 aspect-square bg-card rounded-3xl -z-0 opacity-50 
          group-hover:scale-105 transition-all duration-700
        `}
            />

            <motion.div
                whileHover={product.isAvailable ? { y: -16 } : undefined}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-1/2 relative z-10 p-4"
            >
                <button
                    onClick={handleFavorite}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 z-20 ${isFav ? 'text-red-500' : 'text-text/40 hover:text-red-500'}`}
                >
                    <motion.svg
                        whileTap={{ scale: 0.8 }}
                        className="w-6 h-6"
                        fill={isFav ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </motion.svg>
                </button>
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-contain drop-shadow-2xl"
                    loading="lazy"
                />
            </motion.div>
        </motion.div>
    );
}

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    return (
        <section className="px-6 py-12 flex flex-col gap-16 max-w-6xl mx-auto">
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    reversed={index % 2 !== 0}
                />
            ))}
        </section>
    );
}
