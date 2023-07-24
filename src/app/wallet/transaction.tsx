import type { TransactionTypes } from '@/types';

import { formatDate, getTimeZoneString } from '@/lib/utils';
import { dropsToXrp } from 'xrpl';

type TransactionProps = {
  date: number;
  fee: string;
  transactionType: EnumAsUnion<typeof TransactionTypes>;
};

export default function Transaction({
  date,
  fee,
  transactionType,
}: TransactionProps) {
  return (
    <div className='grid gap-y-4 border-b border-dashed py-6'>
      <div className='grid'>
        <span className='font-medium text-accents-3'>
          Time ({getTimeZoneString(date)})
        </span>
        <span>{formatDate(date)}</span>
      </div>
      <div className='flex justify-between'>
        <div className='grid'>
          <span className='font-medium text-accents-3'>Transaction Type</span>
          <span>{transactionType}</span>
        </div>
        <div className='grid text-right'>
          <span className='font-medium text-accents-3'>Transaction Cost</span>
          <span>{dropsToXrp(fee)}</span>
        </div>
      </div>
    </div>
  );
}
