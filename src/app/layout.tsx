import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Toko Kopi Khaleed | Open 24 Hours",
  description: "Timeless fluidity in every drop. Crafting moments for the thinkers, rushers, and dreamers. Pre-order your favorite coffee now.",
  keywords: ["coffee", "kopi", "sidoarjo", "24 jam", "pre-order", "khaleed"],
  openGraph: {
    title: "Toko Kopi Khaleed",
    description: "Timeless fluidity in every drop",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDF8F1" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0D0D" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${jakarta.variable} font-sans antialiased`}
      >
        {/* Grainy Overlay for Vintage Feel */}
        <div className="grainy-overlay" aria-hidden="true" />

        {/* Theme Wave Transition Effect */}
        <div id="theme-wave" className="theme-wave" aria-hidden="true" />

        {/* Main Content */}
        <main className="min-h-screen bg-bg text-text transition-colors duration-700">
          {children}
        </main>
      </body>
    </html>
  );
}
