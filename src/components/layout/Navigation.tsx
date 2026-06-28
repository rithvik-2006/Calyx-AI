'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const navItems = [
  { name: 'Home', href: '/dashboard', icon: 'home' },
  { name: 'Search', href: '/search', icon: 'search' },
  { name: 'Plates', href: '/plates', icon: 'restaurant_menu' },
  { name: 'AI', href: '/ai', icon: 'mic' },
  // { name: 'Settings', href: '/settings', icon: 'settings' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* BottomNavBar - Mobile */}
      <nav className="bg-surface-container-low border-t border-outline-variant fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-lg py-md pb-safe md:hidden">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={twMerge(
                clsx(
                  'flex flex-col items-center justify-center transition-transform duration-200',
                  isActive 
                    ? 'text-primary scale-110 active:scale-90' 
                    : 'text-on-surface-variant opacity-60 hover:text-primary hover:opacity-100'
                )
              )}
            >
              <span 
                className="material-symbols-outlined" 
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="font-label-caps text-[10px] mt-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[200px] border-r border-[#242424] bg-[#0B0B0B] p-lg z-50">
        <div className="flex items-center gap-sm mb-xl">
          <img src="/logo.png" alt="Calyx AI" className="w-8 h-8 rounded-full object-cover" />
          <div className="text-headline-md font-headline-md font-semibold tracking-tight text-on-surface">
            Calyx AI
          </div>
        </div>
        <div className="flex flex-col gap-md">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={twMerge(
                  clsx(
                    'flex items-center gap-sm transition-opacity',
                    item.name === 'Settings' ? 'mt-auto' : '',
                    isActive
                      ? 'text-primary'
                      : 'text-on-surface-variant opacity-60 hover:opacity-100'
                  )
                )}
              >
                <span 
                  className="material-symbols-outlined" 
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="font-label-caps uppercase">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
