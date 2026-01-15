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

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            className={`product-card group relative ${product.isAvailable ? 'cursor-pointer' : ''}`}
            onClick={handleCardClick}
        >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="order-2 md:order-1 z-10 text-center md:text-left">
                    <h3 className="font-serif text-2xl md:text-3xl mb-1">{product.name}</h3>
                    <p className="text-accent font-semibold mb-4">{formatRupiah(product.price)}</p>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        disabled={!product.isAvailable}
                        className={`
                            px-6 py-3 bg-text text-bg rounded-full text-xs font-bold tracking-widest
                            transition-all duration-300 w-full md:w-auto
                            ${product.isAvailable ? 'hover:shadow-lg' : 'opacity-50 cursor-not-allowed'}
                        `}
                    >
                        {product.isAvailable ? 'ADD TO CART +' : 'SOLD OUT'}
                    </motion.button>
                </div>

                <div className="order-1 md:order-2 relative">
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="relative z-10"
                    >
                        <button
                            onClick={handleFavorite}
                            className={`absolute -top-2 -right-2 p-2.5 rounded-full glass z-20 touch-manipulation ${isFav ? 'text-red-500' : 'text-text/40 hover:text-red-500'}`}
                        >
                            <motion.svg
                                whileTap={{ scale: 0.8 }}
                                className="w-5 h-5"
                                fill={isFav ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </motion.svg>
                        </button>
                        <div className="w-32 h-32 md:w-48 md:h-48 mx-auto bg-card rounded-3xl overflow-hidden shadow-lg">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain p-2"
                                loading="lazy"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    return (
        <section className="px-4 md:px-6 py-8 md:py-12 flex flex-col gap-8 md:gap-16 max-w-2xl mx-auto">
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                />
            ))}
        </section>
    );
}
