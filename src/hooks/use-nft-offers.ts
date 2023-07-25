import { NftSellOffersContext } from '@/providers/nft-offers-provider';
import { useContext } from 'react';

export function useNftSellOffers() {
  const context = useContext(NftSellOffersContext);
  if (!context) {
    throw new Error(
      'useNftSellOffers must be used within an NftSellOffersProvider',
    );
  }
  const { nftSellOffers, refetch } = context;
  return { nftSellOffers, refetchNftSellOffers: refetch };
}
