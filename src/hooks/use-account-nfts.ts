import { NftsContext } from '@/providers/nfts-provider';
import { useContext } from 'react';

export function useAccountNfts() {
  const context = useContext(NftsContext);
  if (!context) {
    throw new Error('useAccountNfts must be used within NftsProvider');
  }
  const { nfts, refetchNfts } = context;
  return { nfts, refetchNfts };
}
