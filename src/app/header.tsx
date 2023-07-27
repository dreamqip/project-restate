'use client';

import NavLink from '@/components/nav-link';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PATHS_WITHOUT_LINKS = [
  '/wallet/create',
  '/wallet/verify',
  '/wallet/import',
  '/wallet/set-password',
  '/wallet/login',
];

export default function Header() {
  const path = usePathname();

  return (
    <header className='mb-16 px-4 pt-4 sm:px-32 sm:pt-32'>
      <nav>
        <Link href='/'>
          <Image alt='asset image' height={40} src='/logo.svg' width={154} />
        </Link>
        {PATHS_WITHOUT_LINKS.includes(path) ? null : (
          <ul className='mt-6 flex flex-wrap gap-x-4 whitespace-nowrap text-lg font-medium text-accents-3'>
            <li className='transition-colors hover:text-foreground'>
              <NavLink href='/marketplace/offers'>01 Offers</NavLink>
            </li>
            <li className='transition-colors hover:text-foreground'>
              <NavLink href='/marketplace/portfolio'>02 Portfolio</NavLink>
            </li>
            <li className='transition-colors hover:text-foreground'>
              <NavLink href='/wallet'>03 XRPL Wallet</NavLink>
            </li>
            <li className='transition-colors hover:text-foreground'>
              <NavLink href='/wallet/settings'>04 Settings</NavLink>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
