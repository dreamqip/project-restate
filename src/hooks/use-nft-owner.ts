import { useWalletDetails } from '@/hooks/use-wallet-details';
import { useXRPLClient } from '@/hooks/use-xrpl-client';
import { useEffect, useState } from 'react';

export function useNftOwner(nftId: string) {
  const [nftOwner, setNftOwner] = useState<string>('abs');

  const { client } = useXRPLClient();
  const { accountAddress } = useWalletDetails();

  useEffect(() => {
    async function fetchNftSellOffers() {
      try {
        const response = await client.request({
          // Does not work since Clio is not set up
          command: 'nft_info',
          nft_id: nftId,
        });
        console.log(response);
        setNftOwner(response.result.owner);
      } catch (err) {
        console.error(err);
      }
    }

    if (accountAddress) fetchNftSellOffers();
  }, [client, nftId, accountAddress]);

  return nftOwner;
}
