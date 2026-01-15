'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCartStore, CartItem } from '@/lib/store/useCartStore';
import { formatRupiah } from '@/lib/utils';
import { useThemeStore } from '@/lib/store/useThemeStore';

type OrderType = 'dine-in' | 'takeaway';

export default function CheckoutPage() {
    const router = useRouter();
    const { initializeTheme } = useThemeStore();
    const { items, getTotalPrice, clearCart } = useCartStore();

    const [mounted, setMounted] = useState(false);
    const [orderType, setOrderType] = useState<OrderType>('takeaway');
    const [name, setName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
        initializeTheme();
    }, [initializeTheme]);

    useEffect(() => {
        if (mounted && items.length === 0) {
            router.push('/');
        }
    }, [mounted, items.length, router]);

    const totalPrice = getTotalPrice();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !whatsapp.trim()) return;

        setLoading(true);

        const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
        const date = new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        let message = `*PESANAN BARU - KHALEED COFFEE*\n\n`;
        message += `*No. Pesanan:* ${orderNumber}\n`;
        message += `*Tanggal:* ${date}\n`;
        message += `*Jenis:* ${orderType === 'dine-in' ? 'Dine In' : 'Takeaway'}\n\n`;
        message += `*DATA PELANGGAN*\n`;
        message += `Nama: ${name}\n`;
        message += `WhatsApp: ${whatsapp}\n`;
        if (orderType === 'takeaway' && address.trim()) {
            message += `Alamat: ${address}\n`;
        }
        message += `\n`;

        message += `*PESANAN:*\n`;
        items.forEach((item) => {
            message += `${item.quantity}x ${item.name}`;
            if (item.notes) message += ` (${item.notes})`;
            message += ` - ${formatRupiah(item.price * item.quantity)}\n`;
        });

        message += `\n*TOTAL: ${formatRupiah(totalPrice)}*\n`;

        if (notes.trim()) {
            message += `\n*CATATAN:* ${notes}`;
        }

        message += `\n\nMohon konfirmasi pesanan ini. Terima kasih! 🙏`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = '6281234567890';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        setTimeout(() => {
            clearCart();
            window.open(whatsappUrl, '_blank');
            router.push('/checkout/success');
        }, 500);
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-bg">
            <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[400px]">
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="glass px-6 py-4 rounded-full flex items-center justify-between shadow-lg"
                >
                    <Link href="/" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-semibold">Back</span>
                    </Link>
                    <span className="font-serif text-lg font-bold tracking-tight">CHECKOUT</span>
                    <div className="w-20" />
                </motion.div>
            </header>

            <main className="pt-32 px-6 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="glass p-6 rounded-3xl space-y-6">
                            <h2 className="font-serif text-xl">Jenis Pesanan</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setOrderType('takeaway')}
                                    className={`p-4 rounded-2xl text-sm font-semibold transition-all ${
                                        orderType === 'takeaway'
                                            ? 'bg-text text-bg'
                                            : 'glass hover:bg-card'
                                    }`}
                                >
                                    Takeaway
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOrderType('dine-in')}
                                    className={`p-4 rounded-2xl text-sm font-semibold transition-all ${
                                        orderType === 'dine-in'
                                            ? 'bg-text text-bg'
                                            : 'glass hover:bg-card'
                                    }`}
                                >
                                    Dine In
                                </button>
                            </div>
                        </div>

                        <div className="glass p-6 rounded-3xl space-y-4">
                            <h2 className="font-serif text-xl">Data Diri</h2>
                            <div>
                                <label className="block text-xs font-semibold opacity-60 mb-2">Nama</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nama lengkap"
                                    required
                                    className="w-full glass px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold opacity-60 mb-2">WhatsApp</label>
                                <input
                                    type="tel"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    placeholder="08123456789"
                                    required
                                    className="w-full glass px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                                />
                            </div>
                            {orderType === 'takeaway' && (
                                <div>
                                    <label className="block text-xs font-semibold opacity-60 mb-2">Alamat</label>
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Jl. Raden Patah No.33, Sidoarjo"
                                        className="w-full glass px-4 py-3 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                                        rows={3}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="glass p-6 rounded-3xl space-y-4">
                            <h2 className="font-serif text-xl">Catatan</h2>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Catatan untuk pesanan..."
                                className="w-full glass px-4 py-3 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                                rows={3}
                            />
                        </div>

                        <div className="glass p-6 rounded-3xl space-y-4">
                            <h2 className="font-serif text-xl">Ringkasan Pesanan</h2>
                            <div className="space-y-3">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="opacity-60">{item.quantity}x</span>
                                            <span>{item.name}</span>
                                        </div>
                                        <span>{formatRupiah(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4 border-t border-text/10 flex justify-between items-center">
                                <span className="font-semibold">Total</span>
                                <span className="font-serif text-xl font-bold text-accent">{formatRupiah(totalPrice)}</span>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading || !name.trim() || !whatsapp.trim()}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-text text-bg py-4 rounded-full font-bold tracking-widest text-sm hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? 'Memproses...' : 'PESAN VIA WHATSAPP'}
                        </motion.button>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}
