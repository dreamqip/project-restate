'use client';

import type { Transaction as XRPLTransaction } from 'xrpl';
import type { ResponseOnlyTxInfo } from 'xrpl/dist/npm/models/common';

import { Button } from '@/components/ui';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useLedger } from '@/hooks/use-ledger';
import { useWallet } from '@/hooks/use-wallet';
import { useWalletDetails } from '@/hooks/use-wallet-details';
import { useXRPLClient } from '@/hooks/use-xrpl-client';
import { formatAmount } from '@/lib/format';
import { countXRPDifference } from '@/lib/xrpl';
import { TransactionTypes } from '@/types';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CornerLeftDownIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import SendDialog from './send-dialog';
import Transaction from './transaction';

const FIXED_DOLLAR_RATE = 3;

export default function Wallet() {
  const router = useRouter();
  const { client } = useXRPLClient();
  const { wallet } = useWallet();
  const { getTransactions } = useLedger();

  const [balanceDifference, setBalanceDifference] = useState<number>(0);
  const [refetch, setRefetch] = useState<boolean>(false);

  const { accountAddress, accountExists, balance } = useWalletDetails(refetch);

  const [transactions, setTransactions] = useState<
    (XRPLTransaction & ResponseOnlyTxInfo)[] | null
  >(null);
  const [nextMarker, setNextMarker] = useState<undefined | unknown>(undefined);
  const [previousMarkers, setPreviousMarkers] = useState<
    (undefined | unknown)[]
  >([]);

  const [_, copy] = useCopyToClipboard();

  const computedBalance = useMemo(
    () => (Number(balance) + balanceDifference).toFixed(2),
    [balance, balanceDifference],
  );

  useEffect(() => {
    // If there is no wallet in the context and no wallet in the local storage
    // redirect to the create wallet page
    if (!wallet && !localStorage.getItem('wallet')) {
      router.replace('/wallet/create');
    }

    // If there is no wallet in the context but there is a wallet in the local storage
    // redirect to the login page
    if (!wallet && localStorage.getItem('wallet')) {
      router.replace('/wallet/login');
    }
  }, [router, wallet]);

  useEffect(() => {
    fetchNextTransactions();
  }, []);

  // Subscribe to the account transactions stream
  useEffect(() => {
    if (!wallet || !client) {
      return;
    }

    // In strict mode, useEffect is called twice, so we need to make sure we only set state once
    // https://react.dev/learn/synchronizing-with-effects#fetching-data
    let ignore = false;

    const subscribeToTxStream = async () => {
      await client.request({
        accounts: [wallet.classicAddress],
        command: 'subscribe',
      });

      client.on('transaction', (tx) => {
        if (!ignore) {
          const balanceDifference = countXRPDifference(
            tx.meta?.AffectedNodes || [],
            wallet.classicAddress,
          );
          console.log('balanceDifference', balanceDifference);

          if (balanceDifference) {
            const receivedAmount = balanceDifference.received
              ? Number(balanceDifference.xrp_amount)
              : 0;
            const spentAmount = balanceDifference.spent
              ? Number(balanceDifference.xrp_amount)
              : 0;

            if (balanceDifference.funded) {
              setRefetch(true);
            }

            setBalanceDifference((prev) => prev + receivedAmount - spentAmount);
          }

          setTransactions((prev) => [tx.transaction, ...(prev || [])]);
        }
      });
    };

    subscribeToTxStream();

    // Clean up the subscription when the component unmounts
    return () => {
      ignore = true;
      if (client) {
        client.off('transaction', () => {
          console.log('unsubscribed');
        });
      }
    };
  }, [client, wallet]);

  const handleCopy = useCallback(() => {
    const promise = copy(wallet?.classicAddress || '');
    toast.promise(promise, {
      error: 'Error copying address',
      loading: 'Copying address...',
      success: 'Address copied!',
    });
  }, [copy, wallet?.classicAddress]);

  // Fetch latest transactions if the user paginated
  const fetchNextTransactions = useCallback(async () => {
    if (!wallet || !client) {
      return;
    }

    try {
      // Get the second latest marker from the previousMarkers array and remove latest from the array
      // If there's only one marker then we are at the end of the list of transactions and we should pass undefined as the marker
      // To get the first page of transactions
      const nextMarker =
        previousMarkers.length === 1
          ? undefined
          : // Get the second to last marker because the last marker is the current marker
            previousMarkers[previousMarkers.length - 2];

      console.log('fetchNextTransactions | nextMarker', nextMarker);

      setPreviousMarkers((prevMarkers) => prevMarkers.slice(0, -1));

      const { marker, transactions: previousTransactions } =
        await getTransactions({
          limit: 10,
          marker: nextMarker,
        });

      // Replace the current transactions with the new ones
      setTransactions(
        previousTransactions.map((tx) => tx.tx as XRPLTransaction),
      );

      // Update nextMarker state
      setNextMarker(marker);
    } catch (error) {
      console.log(error);
    }
  }, [client, getTransactions, previousMarkers, wallet]);

  // E.g. Older transactions
  const fetchPreviousTransactions = useCallback(async () => {
    if (!wallet || !client) {
      return;
    }

    try {
      // const marker = previousMarkers.pop();
      // if (!marker) return; // If there are no previous markers, we are at the first page.

      const { marker, transactions } = await getTransactions({
        limit: 10,
        marker: nextMarker,
      });

      // Replace the current transactions with the new ones
      setTransactions(transactions.map((tx) => tx.tx as XRPLTransaction));

      // Do not add undefined marker or click on next button would go to the start of the list
      if (marker) {
        // Store the current nextMarker into previousMarkers array
        setPreviousMarkers((prevMarkers) => [...prevMarkers, marker]);
      }

      // Update nextMarker state
      setNextMarker(marker);
    } catch (error) {
      console.log(error);
    }
  }, [client, getTransactions, nextMarker, wallet]);

  if (!wallet) {
    return null;
  }

  return (
    <div className='max-w-sm'>
      <h1 className='mb-3 text-3xl font-bold'>XRPL Wallet</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus
        nunc bibendum viverra pretium.
      </p>
      <div className='my-8 flex flex-wrap items-baseline gap-x-4'>
        <span className='text-4xl font-semibold tracking-tight'>
          {accountExists ? computedBalance : '0'} XRP
        </span>
        <span className='text-lg text-accents-3'>
          {/* Weird computation but it works */}~{' '}
          {accountExists
            ? Number(+computedBalance * FIXED_DOLLAR_RATE).toFixed(2)
            : '0'}{' '}
          USD
        </span>
      </div>
      <div className='grid grid-cols-2 items-center gap-x-4'>
        {/* Renders button as the child of the DialogTrigger component */}
        <SendDialog
          accountExists={accountExists}
          address={wallet.classicAddress}
        />
        <Button onClick={handleCopy} prefixIcon={<CornerLeftDownIcon />}>
          Receive
        </Button>
      </div>
      {transactions && transactions.length > 0 && accountExists && (
        <div className='mt-8 border-t border-dashed border-accents-3'>
          <Transactions
            publicAddress={accountAddress?.address || ''}
            transactions={transactions}
          />
          <div className='mt-8 flex justify-between gap-x-4'>
            <Button
              className='p-0 text-base font-normal'
              disabled={previousMarkers.length === 0}
              onClick={fetchNextTransactions}
              prefixIcon={<ChevronLeftIcon />}
              variant='ghost'
            >
              Next
            </Button>
            <Button
              className='p-0 text-base font-normal'
              disabled={!nextMarker}
              onClick={fetchPreviousTransactions}
              suffixIcon={<ChevronRightIcon />}
              variant='ghost'
            >
              Previous
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const Transactions = ({
  publicAddress,
  transactions,
}: {
  publicAddress: string;
  transactions: (XRPLTransaction & ResponseOnlyTxInfo)[];
}) => {
  return (
    <>
      {transactions.map((transaction) => (
        <Transaction
          amount={
            TransactionTypes.Payment === transaction?.TransactionType
              ? formatAmount(transaction.Amount)
              : '0 XRP'
          }
          received={
            'Destination' in transaction
              ? transaction.Destination === publicAddress
              : false
          }
          date={transaction?.date || 0}
          fee={transaction?.Fee || '0'}
          key={`${transaction?.hash}-${transaction?.date}`}
          transactionType={transaction?.TransactionType}
        />
      ))}
    </>
  );
};
