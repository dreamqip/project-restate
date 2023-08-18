'use client';

import AssetCatalog from '@/components/asset-catalog';
import { useAccountNfts } from '@/hooks/use-account-nfts';
import { useWallet } from '@/hooks/use-wallet';
import useSWR from 'swr';

export default function Page() {
  const { wallet } = useWallet();
  const { nfts } = useAccountNfts();

  const { data: assets, isLoading } = useSWR(
    nfts.length
      ? `${process.env.NEXT_PUBLIC_HOST}/api/assets`
      : null,
    (url) => {
      return fetch(url, {
        body: JSON.stringify({
          nftIds: nfts.map((nft) => nft.NFTokenID),
        }),
        method: 'POST',
      }).then((res) => res.json());
    },
  );

  if (!wallet) {
    return <div>Please connect your wallet</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return nfts.length ? (
    <AssetCatalog assets={assets} content='Portfolio' />
  ) : (
    <div>You don&apos;t have any NFTs yet</div>
  );
}
