'use client';

import AssetCatalog from '@/components/asset-catalog';
import { useAccountNfts } from '@/hooks/use-account-nfts';
import useSWR from 'swr';

export default function Page() {
  const { nfts } = useAccountNfts();

  const { data: assets, isLoading } = useSWR(
    nfts.length ? `${process.env.NEXT_PUBLIC_HOST}/api/assets` : null,
    (url) => {
      return fetch(url, {
        body: JSON.stringify({
          nftIds: nfts.map((nft) => nft.NFTokenID),
        }),
        method: 'POST',
      }).then((res) => res.json());
    },
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(nfts);
  
  console.log(assets);
  

  // get nft ids from nfts
  // filter by them to get all assets from notion
  // add them to assets and pass below
  return nfts.length ? (
    <AssetCatalog assets={assets} content='Portfolio' />
  ) : (
    <div>Connect Wallet</div>
  );
}
