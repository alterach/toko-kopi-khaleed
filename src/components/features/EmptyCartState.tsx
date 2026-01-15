'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function EmptyCartState() {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[400px]"
        >
            <div className="glass px-6 py-5 rounded-full shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center">
                        <svg className="w-6 h-6 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">
                            Your cart is empty
                        </span>
                        <span className="text-xs opacity-40">Add some coffee ☕</span>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="bg-text text-bg px-5 py-3 rounded-full text-xs font-bold tracking-widest hover:scale-105 transition-transform"
                >
                    BROWSE
                </button>
            </div>
        </motion.div>
    );
}
