import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/app/providers';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/app/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TradePulse',
  description: 'A modern trading platform with real-time market data visualization.',
  other: {
    'cache-version': new Date().toISOString(), // Force new build with timestamp
    'build-id': Math.random().toString(36).substring(7),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <Providers>
          <div className="min-h-screen bg-zinc-950">
            {children}
            <Footer />
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
