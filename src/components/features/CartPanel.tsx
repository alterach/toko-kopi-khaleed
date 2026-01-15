'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, CartItem } from '@/lib/store/useCartStore';
import { formatRupiah } from '@/lib/utils';

export function CartPanel() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const items = useCartStore((state) => state.items);
    const { updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();

    const totalPrice = getTotalPrice();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const handleCheckout = () => {
        if (items.length === 0) return;
        router.push('/checkout');
        setIsOpen(false);
    };

    return (
        <>
            <motion.button
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-text text-bg px-8 py-5 rounded-full shadow-2xl flex items-center gap-4 hover:scale-105 transition-transform"
            >
                <div className="relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-accent text-bg text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                            {totalItems}
                        </span>
                    )}
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60 mb-1">
                        {items.length > 0 ? 'Review Order' : 'Cart'}
                    </span>
                    <span className="font-serif text-lg">{items.length > 0 ? formatRupiah(totalPrice) : 'Empty'}</span>
                </div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-[150]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-[450px] bg-bg z-[200] shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-text/10 flex items-center justify-between">
                                <h2 className="font-serif text-2xl">Your Order</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-10 h-10 rounded-full glass flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {items.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <svg className="w-16 h-16 opacity-30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <p className="opacity-60 mb-4">Your cart is empty</p>
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                router.push('/');
                                            }}
                                            className="text-accent font-semibold hover:underline"
                                        >
                                            Browse Menu
                                        </button>
                                    </div>
                                ) : (
                                    items.map((item) => (
                                        <CartItemRow
                                            key={item.id}
                                            item={item}
                                            onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                                            onRemove={() => removeItem(item.id)}
                                        />
                                    ))
                                )}
                            </div>

                            {items.length > 0 && (
                                <div className="p-6 border-t border-text/10 space-y-4">
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="opacity-60">Total</span>
                                        <span className="font-serif font-bold">{formatRupiah(totalPrice)}</span>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCheckout}
                                        className="w-full bg-text text-bg py-4 rounded-full font-bold tracking-widest text-sm hover:shadow-lg transition-all"
                                    >
                                        CHECKOUT
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

interface CartItemRowProps {
    item: CartItem;
    onUpdateQuantity: (quantity: number) => void;
    onRemove: () => void;
}

function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="glass p-4 rounded-2xl flex gap-4"
        >
            {item.image && (
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                />
            )}
            <div className="flex-1">
                <h4 className="font-serif text-lg">{item.name}</h4>
                <p className="text-accent font-semibold text-sm">{formatRupiah(item.price)}</p>
                {item.notes && (
                    <p className="text-xs opacity-60 mt-1">{item.notes}</p>
                )}
            </div>
            <div className="flex flex-col items-end gap-2">
                <button
                    onClick={onRemove}
                    className="w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="flex items-center gap-2 glass rounded-full px-2 py-1">
                    <button
                        onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                        onClick={() => onUpdateQuantity(item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
