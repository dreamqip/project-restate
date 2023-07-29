import type { FullAssetWithPageId } from '@/types/notion';

import AssetPage from '@/components/asset';
import { NftOffersProvider } from '@/providers/nft-offers-provider';

export default function AssetWrapper({
  asset,
  nftId,
}: {
  asset: FullAssetWithPageId;
  nftId: string;
}) {
  return (
    <NftOffersProvider nftId={nftId}>
      <AssetPage asset={asset} />
    </NftOffersProvider>
  );
}
