'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useState,
} from 'react';
import { Wallet as xrplWallet } from 'xrpl';

import { getWallet } from '../lib/wallet';

type WalletContextType = {
  setWallet: (wallet: xrplWallet) => void;
  signIn: (password: string) => void;
  signOut: () => void;
  wallet: undefined | xrplWallet;
};

export const WalletContext = createContext<undefined | WalletContextType>(
  undefined,
);

export function WalletProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [wallet, setWallet] = useState<undefined | xrplWallet>(undefined);

  const signIn = useCallback((password: string) => {
    const walletFromStorage = getWallet(password);
    if (!walletFromStorage) {
      return;
    }

    if (walletFromStorage.seed) {
      const wallet = xrplWallet.fromSeed(walletFromStorage.seed);
      setWallet(wallet);
      console.log('wallet instance', wallet);
      return;
    }

    const wallet = new xrplWallet(
      walletFromStorage.publicKey,
      walletFromStorage.privateKey,
    );
    setWallet(wallet);

    console.log('wallet instance', wallet);
  }, []);

  const signOut = useCallback(() => {
    setWallet(undefined);
    router.push('/wallet/import');
  }, [router]);

  return (
    <WalletContext.Provider
      value={{
        setWallet,
        signIn,
        signOut,
        wallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
