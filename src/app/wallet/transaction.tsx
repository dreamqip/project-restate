import { cn, formatDate, getTimeZoneString } from '@/lib/utils';
import { TransactionTypes } from '@/types';
import { dropsToXrp } from 'xrpl';

type TransactionProps = {
  amount: string;
  date: number;
  fee: string;
  received: boolean;
  transactionType: EnumAsUnion<typeof TransactionTypes>;
};

export default function Transaction({
  amount,
  date,
  fee,
  received,
  transactionType,
}: TransactionProps) {
  return (
    <div className='grid gap-y-4 border-b border-dashed py-6'>
      <div className='flex items-center justify-between'>
        <div className='grid'>
          <span className='font-medium text-accents-3'>
            Time ({getTimeZoneString(date)})
          </span>
          <span>{formatDate(date)}</span>
        </div>
        <div className='grid text-right'>
          <span className='font-medium text-accents-3'>Transaction Cost</span>
          <span>{dropsToXrp(fee)}</span>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <div className='grid'>
          <span className='font-medium text-accents-3'>Transaction Type</span>
          <span>{transactionType}</span>
        </div>
        {transactionType === TransactionTypes.Payment && (
          <div className='grid text-right'>
            <span className='font-medium text-accents-3'>Amount</span>
            <span
              className={cn({
                'text-[hsl(97,_57%,_46%)]': received,
                'text-error': !received,
              })}
            >
              {amount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
