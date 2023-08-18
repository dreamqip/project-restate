import { NftOffersContext } from '@/providers/nft-offers-provider';
import { useContext } from 'react';

export function useNftOwner() {
  const context = useContext(NftOffersContext);
  if (!context) {
    throw new Error('useNftOwner must be used within NftOffersProvider');
  }
  const { isOwner } = context;
  return { isOwner };
}
