import { WalletContext } from '@/providers/wallet-provider';
import { useContext } from 'react';

export function useWallet() {
  const wallet = useContext(WalletContext);

  if (!wallet) {
    throw new Error('useWallet must be used within a WalletProvider');
  }

  return wallet;
}
