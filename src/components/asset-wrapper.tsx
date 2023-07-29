import type { FullAsset } from '@/types/notion';

import AssetPage from '@/components/asset';
import { NftOffersProvider } from '@/providers/nft-offers-provider';

export default function AssetWrapper({
  asset,
  nftId,
}: {
  asset: FullAsset;
  nftId: string;
}) {
  return (
    <NftOffersProvider nftId={nftId}>
      <AssetPage asset={asset} />
    </NftOffersProvider>
  );
}
