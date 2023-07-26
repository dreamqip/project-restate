import type { AccountRoot, SignerList } from 'xrpl/dist/npm/models/ledger';

import { getWalletDetails } from '@/lib/xrpl';
import { useCallback, useEffect, useState } from 'react';
import { dropsToXrp } from 'xrpl';

import { useIsConnected } from './use-is-connected';
import { useWallet } from './use-wallet';
import { useXRPLClient } from './use-xrpl-client';

type XRPLAddress = {
  address: string;
  xAddress: string;
};

export function useWalletDetails(refetch: boolean = false) {
  const { client } = useXRPLClient();
  const { wallet } = useWallet();
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

  const getBalance = useCallback(async () => {
    if (!client || !isConnected || !wallet) {
      return;
    }

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
  }, [client, isConnected, wallet]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  useEffect(() => {
    if (refetch) {
      getBalance();
    }
  }, [client, isConnected, wallet, refetch, getBalance]);

  return {
    accountAddress,
    accountData,
    accountExists,
    accountReserves,
    balance,
  };
}
