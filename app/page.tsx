'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 via-zinc-900/80 to-zinc-900/90"></div>
      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 to-zinc-400">
          Welcome to TradePulse
        </h1>
        <p className="mt-6 text-lg leading-8 text-zinc-400">
          A modern trading platform with real-time market data visualization and portfolio management.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/dashboard">
            <Button className="bg-zinc-200 text-zinc-900 hover:bg-zinc-300 hover:text-zinc-900">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
