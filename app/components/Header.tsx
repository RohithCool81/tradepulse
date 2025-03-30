'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Activity, LineChart } from 'lucide-react';

export function Header() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Markets', href: '/markets' },
  ];

  return (
    <>
      {/* Spacer div to prevent content from hiding under fixed header */}
      <div className="h-16"></div>
      
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center">
          <div className="mr-8">
            <Link 
              href="/" 
              className="flex items-center space-x-2 transition-transform hover:scale-[1.02]"
            >
              <div className="relative flex items-center">
                <LineChart className="w-6 h-6 text-blue-500" />
                <Activity className="w-6 h-6 text-violet-500 absolute -right-1 -top-1 opacity-50" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-violet-400 text-transparent bg-clip-text animate-gradient">
                TradePulse
              </span>
            </Link>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative transition-colors hover:text-zinc-100 py-4',
                  pathname === item.href 
                    ? 'text-zinc-100 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-blue-500 after:rounded-full after:animate-slideIn' 
                    : 'text-zinc-400'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
} 