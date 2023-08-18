import { NftOffersContext } from '@/providers/nft-offers-provider';
import { useContext } from 'react';

export function useNftSellOffers() {
  const context = useContext(NftOffersContext);
  if (!context) {
    throw new Error('useNftSellOffers must be used within NftOffersProvider');
  }
  const { refetchSellOffers, sellOffers } = context;
  return { refetchSellOffers, sellOffers };
}
