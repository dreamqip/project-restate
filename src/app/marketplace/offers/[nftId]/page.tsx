'use client';

import { MARKUP_PRODUCT } from '@/app/marketplace/test-product';
import ProductPage from '@/components/product';
import { NftSellOffersProvider } from '@/providers/nft-offers-provider';
import { useParams } from 'next/navigation';

export default function Page() {
  const { nftId }: { nftId?: string | undefined } = useParams();
  // get here product by nftId and pass it down

  return (
    <NftSellOffersProvider nftId={nftId}>
      <ProductPage product={MARKUP_PRODUCT} />
    </NftSellOffersProvider>
  );
}
