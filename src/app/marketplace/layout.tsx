'use client';

import { NftsProvider } from '@/providers/nfts-provider';

export default function MarketPlaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NftsProvider>
      <main className='px-4 pb-4 sm:px-32 sm:pb-32'>{children}</main>
    </NftsProvider>
  );
}
