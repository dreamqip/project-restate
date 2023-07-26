'use client';

import { useMnemonics } from '@/hooks/use-mnemonics';
import { getMnemonics, removeMnemonics } from '@/lib/mnemonics';
import { getWallet, removeWallet } from '@/lib/wallet';
import { useRouter } from 'next/navigation';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useState,
} from 'react';
import { Wallet as xrplWallet } from 'xrpl';

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
  const { setMnemonics } = useMnemonics();
  const [wallet, setWallet] = useState<undefined | xrplWallet>(undefined);

  const signIn = useCallback(
    (password: string) => {
      const walletFromStorage = getWallet(password);
      if (!walletFromStorage) {
        return;
      }

      // Get mnemonics from storage and set it to context
      const mnemonics = getMnemonics(password);

      if (mnemonics) {
        setMnemonics(mnemonics.split(' '));
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
    },
    [setMnemonics],
  );

  const signOut = useCallback(() => {
    // Clear mnemonics and wallet from context
    setWallet(undefined);
    setMnemonics([]);

    // Clear mnemonics and wallet from storage
    removeWallet();
    removeMnemonics();

    router.push('/wallet/import');
  }, [router, setMnemonics]);

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
