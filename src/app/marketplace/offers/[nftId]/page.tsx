'use client';

import { MARKUP_PRODUCT } from '@/app/marketplace/test-product';
import ProductPage from '@/components/product';
import { NftsProvider } from '@/providers/nfts-provider';
import { useParams } from 'next/navigation';

export default function Page() {
  const { nftId }: { nftId?: string | undefined } = useParams();
  // get here product by nftId and pass it down

  return (
    <NftsProvider nftId={nftId}>
      <ProductPage product={MARKUP_PRODUCT} />
    </NftsProvider>
  );
}
