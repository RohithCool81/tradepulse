'use client';

import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  
  // Don't show on home page
  if (pathname === '/') return null;

  return (
    <footer className="fixed bottom-4 right-4 text-sm text-muted-foreground/50 pointer-events-none select-none">
      Created by Rohith Pulikonda
    </footer>
  );
} 