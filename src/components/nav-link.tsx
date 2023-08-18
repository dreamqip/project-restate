'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const path = usePathname();
  const isActive = href === path;

  return (
    <Link className={cn({ 'text-foreground': isActive })} href={href}>
      {children}
    </Link>
  );
}
