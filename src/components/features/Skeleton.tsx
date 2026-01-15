'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export function Skeleton({
    className = '',
    variant = 'rectangular',
    width,
    height,
}: SkeletonProps) {
    const baseClass = 'bg-card animate-pulse';

    const variantClass = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-2xl',
    };

    const style = {
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    };

    return (
        <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: 'reverse',
            }}
            className={`${baseClass} ${variantClass[variant]} ${className}`}
            style={style}
        />
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="product-card group relative flex items-center justify-between">
            <div className="w-1/2 z-10 space-y-4">
                <Skeleton width="60%" height={40} className="rounded-lg" />
                <Skeleton width="40%" height={24} className="rounded-lg" />
                <Skeleton width="120px" height={48} className="rounded-full" />
            </div>

            <div className="absolute right-0 w-3/5 aspect-square bg-card rounded-3xl opacity-30" />

            <div className="w-1/2 relative z-10 p-4">
                <Skeleton width={48} height={48} variant="circular" className="absolute top-2 right-2 z-20" />
                <Skeleton width="100%" height="100%" className="aspect-square" />
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <section className="px-6 py-12 flex flex-col gap-16 max-w-6xl mx-auto">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </section>
    );
}

export function ProductDetailSkeleton() {
    return (
        <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="relative aspect-square bg-card rounded-3xl overflow-hidden">
                <Skeleton width="100%" height="100%" />
            </div>

            <div className="space-y-8">
                <div className="space-y-4">
                    <Skeleton width="30%" height={16} />
                    <Skeleton width="70%" height={48} className="rounded-lg" />
                    <Skeleton width="40%" height={32} className="rounded-lg" />
                </div>

                <Skeleton width="100%" height={60} className="rounded-2xl" />

                <div className="space-y-4">
                    <Skeleton width="100%" height={80} className="rounded-2xl" />
                    <Skeleton width="100%" height={56} className="rounded-full" />
                </div>
            </div>
        </div>
    );
}
