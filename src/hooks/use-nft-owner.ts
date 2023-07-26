import { NftsContext } from '@/providers/nfts-provider';
import { useContext } from 'react';

export function useNftOwner() {
  const context = useContext(NftsContext);
  if (!context) {
    throw new Error('useNftOwner must be used within NftsProvider');
  }
  const { isOwner } = context;
  return { isOwner };
}
