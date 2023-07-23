'use client';

import { Button } from '@/components/ui';
import { useLedger } from '@/hooks/use-ledger';
import { useWallet } from '@/hooks/use-wallet';
import { useWalletDetails } from '@/hooks/use-wallet-details';
import { type AccountTransaction, TransactionTypes } from '@/types';
import { CornerLeftDownIcon, SendIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Transaction from './transaction';

const FIXED_DOLLAR_RATE = 3;

export default function Wallet() {
  const router = useRouter();
  const { fundWallet, getTransactions } = useLedger();
  const { wallet } = useWallet();
  const { accountExists, balance } = useWalletDetails();

  const [transactions, setTransactions] = useState<AccountTransaction[] | null>(
    null,
  );

  useEffect(() => {
    if (!wallet && localStorage.getItem('wallet')) {
      router.replace('/wallet/login');
    } else if (!wallet) {
      router.replace('/wallet/create');
    }
  }, [router, wallet]);

  useEffect(() => {
    const getTx = async () => {
      const tx = await getTransactions();
      console.log('tx', tx);
      setTransactions(tx);
    };

    if (wallet) {
      getTx();
    }
  }, [getTransactions, wallet]);

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
      <div className='my-8 flex items-baseline gap-x-4'>
        <span className='text-4xl font-semibold tracking-tight'>
          {accountExists ? balance : '0'} XRP
        </span>
        <span className='text-lg text-accents-3'>
          ~ {accountExists ? Number(balance) * FIXED_DOLLAR_RATE : '0'} USD
        </span>
      </div>
      <div className='grid grid-cols-2 items-center gap-x-4'>
        <Button prefixIcon={<SendIcon />}>Send</Button>
        <Button prefixIcon={<CornerLeftDownIcon />}>Receive</Button>
      </div>
      <div className='mt-8 border-t border-dashed border-accents-3'>
        {transactions && transactions.length > 0 ? (
          transactions.map((transaction) => (
            <Transaction
              transactionType={
                transaction.tx?.TransactionType || TransactionTypes.Payment
              }
              date={transaction.tx?.date || 0}
              fee={transaction.tx?.Fee || '0'}
              key={`${transaction.tx?.hash}-${transaction.tx?.date}`}
            />
          ))
        ) : (
          <div className='p-4 text-center text-accents-5'>
            No transactions found
            <Button className='mt-4' onClick={fundWallet}>
              Fund wallet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
