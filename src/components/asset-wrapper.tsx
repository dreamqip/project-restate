import type { Product as ProductType } from '@/app/marketplace/test-product';

import AssetPage from '@/components/asset';
import { NftOffersProvider } from '@/providers/nft-offers-provider';

interface AssetProps {
  asset: ProductType;
  nftId: string | undefined;
}

export default function AssetWrapper({ asset, nftId }: AssetProps) {
  return (
    <NftOffersProvider nftId={nftId}>
      <AssetPage asset={asset} />
    </NftOffersProvider>
  );
}
