import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className='mb-16 px-4 pt-4 sm:px-32 sm:pt-32'>
      <nav>
        <Link href='/'>
          <Image alt='asset image' height={27} src='/logo.svg' width={154} />
        </Link>
        <ul className='mt-6 flex flex-wrap gap-x-4 whitespace-nowrap text-lg font-medium text-accents-3'>
          <li>
            <Link href='/marketplace/offers'>01 Offers</Link>
          </li>
          <li>
            <Link href='/marketplace/portfolio'>02 Portfolio</Link>
          </li>
          <li>
            <Link href='/wallet'>03 XRPL Wallet</Link>
          </li>
          <li>
            <Link href='/wallet/settings'>04 Settings</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
