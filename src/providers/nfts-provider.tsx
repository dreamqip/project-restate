import type { AccountNFToken, NFTOffer } from 'xrpl';

import { useIsConnected } from '@/hooks/use-is-connected';
import { useLedger } from '@/hooks/use-ledger';
import { useWallet } from '@/hooks/use-wallet';
import { useXRPLClient } from '@/hooks/use-xrpl-client';
import { createContext, useEffect, useState } from 'react';

export const NftsContext = createContext<{
  isOwner: boolean;
  nfts: AccountNFToken[];
  refetchNfts: () => void;
  refetchSellOffers: () => void;
  sellOffers: NFTOffer[];
}>({
  isOwner: false,
  nfts: [],
  refetchNfts: () => {},
  refetchSellOffers: () => {},
  sellOffers: [],
});

export function NftsProvider({
  children,
  nftId,
}: {
  children: React.ReactNode;
  nftId: string | undefined;
}) {
  const [sellOffers, setSellOffers] = useState<NFTOffer[]>([]);
  const [nfts, setNfts] = useState<AccountNFToken[]>([]);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const [offersRefetchTrigger, setOffersRefetchTrigger] = useState(0);
  const [nftsRefetchTrigger, setNftsRefetchTrigger] = useState(0);

  const { wallet } = useWallet();
  const { getNFTs } = useLedger();
  const { client } = useXRPLClient();
  const isConnected = useIsConnected();

  function refetchSellOffers() {
    setOffersRefetchTrigger((prev) => prev + 1);
  }

  function refetchNfts() {
    setNftsRefetchTrigger((prev) => prev + 1);
  }

  useEffect(() => {
    async function fetchNftSellOffers() {
      try {
        const response = await client.request({
          command: 'nft_sell_offers',
          nft_id: nftId!,
        });
        //console.log(response);
        setSellOffers(response.result.offers);
      } catch (error) {
        setSellOffers([]);
        //console.error(error);
      }
    }

    if (client && isConnected && nftId) {
      fetchNftSellOffers();
    }
  }, [client, nftId, offersRefetchTrigger, isConnected]);

  useEffect(() => {
    async function fetchAccountNfts() {
      try {
        const response = await getNFTs();
        //console.log(response);
        setNfts(response.account_nfts);
      } catch (error) {
        setNfts([]);
        //console.error(error);
      }
    }

    if (wallet) fetchAccountNfts();
  }, [wallet, getNFTs, nftsRefetchTrigger]);

  useEffect(() => {
    if (nftId) setIsOwner(nfts.map((nft) => nft.NFTokenID).includes(nftId));
  }, [nftId, nfts, nftsRefetchTrigger]);

  return (
    <NftsContext.Provider
      value={{
        isOwner,
        nfts,
        refetchNfts,
        refetchSellOffers,
        sellOffers,
      }}
    >
      {children}
    </NftsContext.Provider>
  );
}
