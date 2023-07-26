import { NftsContext } from '@/providers/nfts-provider';
import { useContext } from 'react';

export function useNftSellOffers() {
  const context = useContext(NftsContext);
  if (!context) {
    throw new Error('useNftSellOffers must be used within NftsProvider');
  }
  const { refetchSellOffers, sellOffers } = context;
  return { refetchSellOffers, sellOffers };
}
