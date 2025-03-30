'use client';

import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  
  // Don't show on home page
  if (pathname === '/') return null;

  return (
    <footer className="fixed bottom-0 w-full bg-background/80 backdrop-blur-sm border-t py-2">
      <div className="container flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Designed by Rohith Pulikonda
        </p>
      </div>
    </footer>
  );
} 