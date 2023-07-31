import { NftOffersContext } from '@/providers/nft-offers-provider';
import { useContext } from 'react';

export function useNftId() {
  const context = useContext(NftOffersContext);
  if (!context) {
    throw new Error('useNftId must be used within NftOffersProvider');
  }
  const { nftId } = context;
  return { nftId };
}
