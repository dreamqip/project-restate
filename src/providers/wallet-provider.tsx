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
  signIn: (seed: string, password: string) => void;
  signOut: () => void;
  wallet: undefined | xrplWallet;
};

export const WalletContext = createContext<undefined | WalletContextType>(
  undefined,
);

// TODO: Currently in implementation, not used

export function WalletProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [wallet, setWallet] = useState<undefined | xrplWallet>(undefined);

  const signIn = useCallback((seed: string, password: string) => {
    const wallet = getWallet(password);
    setWallet(wallet);

    console.log(wallet);
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
