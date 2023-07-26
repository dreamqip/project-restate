import type { NFTOffer } from 'xrpl';

import { useWalletDetails } from '@/hooks/use-wallet-details';
import { useXRPLClient } from '@/hooks/use-xrpl-client';
import { createContext, useEffect, useState } from 'react';

export const NftSellOffersContext = createContext<{
  nftSellOffers: NFTOffer[];
  refetch: () => void;
}>({
  nftSellOffers: [],
  refetch: () => {},
});

export function NftSellOffersProvider({
  children,
  nftId,
}: {
  children: React.ReactNode;
  nftId: string | undefined;
}) {
  const [nftSellOffers, setNftSellOffers] = useState<NFTOffer[]>([]);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const { client } = useXRPLClient();
  const { accountAddress } = useWalletDetails();

  useEffect(() => {
    async function fetchNftSellOffers() {
      try {
        const response = await client.request({
          command: 'nft_sell_offers',
          nft_id: nftId!,
        });
        console.log(response);
        setNftSellOffers(response.result.offers);
      } catch (err) {
        console.error(err);
      }
    }

    if (accountAddress && nftId) {
      fetchNftSellOffers();
    }
  }, [client, accountAddress, nftId, refetchTrigger]);

  const refetchNftSellOffers = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return (
    <NftSellOffersContext.Provider
      value={{
        nftSellOffers,
        refetch: refetchNftSellOffers,
      }}
    >
      {children}
    </NftSellOffersContext.Provider>
  );
}
