import type { AccountRoot, SignerList } from 'xrpl/dist/npm/models/ledger';

import { getWallet } from '@/lib/wallet';
import { getWalletDetails } from '@/lib/xrpl';
import { useEffect, useState } from 'react';
import { dropsToXrp } from 'xrpl';

import { useIsConnected } from './use-is-connected';
import { useXRPLClient } from './use-xrpl-client';

type XRPLAddress = {
  address: string;
  xAddress: string;
};

export function useWalletDetails() {
  const { client } = useXRPLClient();
  //   const { wallet } = useWallet();
  const isConnected = useIsConnected();

  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [accountExists, setAccountExists] = useState<boolean>(false);
  const [accountData, setAccountData] = useState<
    (AccountRoot & { signer_lists?: SignerList[] | undefined }) | undefined
  >(undefined);
  const [accountReserves, setAccountReserves] = useState<number | undefined>(
    undefined,
  );
  const [accountAddress, setAccountAddress] = useState<undefined | XRPLAddress>(
    undefined,
  );

  useEffect(() => {
    const getBalance = async () => {
      if (!client || !isConnected) {
        return;
      }

      // TODO: Temporarily hardcoding a wallet address for testing purposes.
      const wallet = getWallet('12345678');

      const walletDetails = await getWalletDetails(client, wallet);

      if (!walletDetails) {
        setAccountExists(false);
        return;
      }

      const { accountData, accountReserves, address, xAddress } = walletDetails;

      setAccountExists(true);
      setAccountAddress({
        address,
        xAddress,
      });
      setAccountData(accountData);
      setAccountReserves(accountReserves);
      // Convert the balance from drops to XRP.
      setBalance(dropsToXrp(accountData.Balance));
    };

    getBalance();
  }, [client, isConnected]);

  return {
    accountAddress,
    accountData,
    accountExists,
    accountReserves,
    balance,
  };
}
