'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/lib/store/useThemeStore';

export default function CheckoutSuccessPage() {
    const router = useRouter();
    const { initializeTheme } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        initializeTheme();
    }, [initializeTheme]);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 5000);
        return () => clearTimeout(timer);
    }, [router]);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="max-w-[400px] w-full text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto mb-8"
                >
                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </motion.div>

                <h1 className="font-serif text-4xl mb-4">Pesanan Diterima!</h1>
                <p className="opacity-60 mb-8">
                    Pesananmu sudah terkirim via WhatsApp. 
                    Tim kami akan segera mengkonfirmasi pesananmu.
                </p>

                <div className="glass p-6 rounded-3xl mb-8">
                    <p className="text-sm opacity-60 mb-2">Tidak ada waktu untuk chat?</p>
                    <p className="text-xs opacity-40">
                        Kamu akan diarahkan ke halaman utama dalam 5 detik...
                    </p>
                </div>

                <Link
                    href="/"
                    className="inline-block bg-text text-bg px-8 py-4 rounded-full font-bold tracking-widest text-sm hover:shadow-lg transition-all"
                >
                    KEMBALI KE MENU
                </Link>
            </motion.div>
        </div>
    );
}
