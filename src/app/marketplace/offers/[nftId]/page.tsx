'use client';

import { MARKUP_PRODUCT } from '@/app/marketplace/test-product';
import AssetWrapper from '@/components/asset-wrapper';
import { useParams } from 'next/navigation';

export default function Page() {
  const { nftId }: { nftId?: string | undefined } = useParams();
  // get here product by nftId and pass it down

  return <AssetWrapper asset={MARKUP_PRODUCT} nftId={nftId} />;
}
