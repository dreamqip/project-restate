import { useLedger } from '@/hooks/use-ledger';
import { useWalletDetails } from '@/hooks/use-wallet-details';
import { useEffect, useState } from 'react';

export function useAccountNfts() {
  const [nfts, setNfts] = useState<string[]>([]);

  const { accountAddress } = useWalletDetails();
  const { getNFTs } = useLedger();

  useEffect(() => {
    async function fetchAccountNfts() {
      // TODO: add loader
      try {
        const response = await getNFTs();
        console.log(response);
        setNfts(response.account_nfts.map((nft) => nft.NFTokenID));
      } catch (error) {
        console.error(error);
      }
    }

    if (accountAddress) fetchAccountNfts();
  }, [accountAddress, getNFTs]);

  return nfts;
}
