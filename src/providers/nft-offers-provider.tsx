import { useWalletDetails } from '@/hooks/use-wallet-details';
import { useXRPLClient } from '@/hooks/use-xrpl-client';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const NftSellOffersContext = createContext<{
  nftSellOffers: string[];
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
  const [nftSellOffers, setNftSellOffers] = useState<string[]>([]);
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
        setNftSellOffers(
          response.result.offers.map((offer) => offer.nft_offer_index),
        );
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
