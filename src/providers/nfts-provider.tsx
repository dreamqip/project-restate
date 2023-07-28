import type { AccountNFToken } from 'xrpl';

import { useLedger } from '@/hooks/use-ledger';
import { useWallet } from '@/hooks/use-wallet';
import { createContext, useEffect, useState } from 'react';

export const NftsContext = createContext<{
  nfts: AccountNFToken[];
  refetchNfts: () => void;
  refetchNftsTrigger: number;
}>({
  nfts: [],
  refetchNfts: () => {},
  refetchNftsTrigger: 0,
});

export function NftsProvider({ children }: { children: React.ReactNode }) {
  const [nfts, setNfts] = useState<AccountNFToken[]>([]);

  const [refetchNftsTrigger, setNftsRefetchTrigger] = useState(0);

  const { wallet } = useWallet();
  const { getNFTs } = useLedger();

  function refetchNfts() {
    setNftsRefetchTrigger((prev) => prev + 1);
  }

  useEffect(() => {
    async function fetchAccountNfts() {
      try {
        const response = await getNFTs();
        //console.log(response);
        setNfts(response.account_nfts);
      } catch (error) {
        setNfts([]);
        //console.error(error);
      }
    }

    if (wallet) fetchAccountNfts();
  }, [wallet, getNFTs, refetchNftsTrigger]);

  return (
    <NftsContext.Provider
      value={{
        nfts,
        refetchNfts,
        refetchNftsTrigger,
      }}
    >
      {children}
    </NftsContext.Provider>
  );
}
