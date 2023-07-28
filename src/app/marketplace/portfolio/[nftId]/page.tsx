'use client';

import { MARKUP_PRODUCT } from '@/app/marketplace/test-product';
import AssetPage from '@/components/asset';
import { NftsProvider } from '@/providers/nfts-provider';
import { useParams } from 'next/navigation';

export default function Page() {
  const { nftId }: { nftId?: string | undefined } = useParams();
  // get here product by nftId and pass it down

  return (
    <NftsProvider nftId={nftId}>
      <AssetPage product={MARKUP_PRODUCT} />
    </NftsProvider>
  );
}
