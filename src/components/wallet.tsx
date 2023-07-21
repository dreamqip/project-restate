import { Button } from '@/components/ui';
import { CornerLeftDownIcon, SendIcon } from 'lucide-react';

import Transaction from './transaction';

export default function Wallet() {
  return (
    <div className='max-w-sm'>
      <h1 className='mb-3 text-3xl font-bold'>XRPL Wallet</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus
        nunc bibendum viverra pretium.
      </p>
      <div className='my-8 flex items-baseline gap-x-4'>
        <span className='text-4xl font-semibold tracking-tight'>7844 XRP</span>
        <span className='text-lg text-accents-3'>~25124.26 USD</span>
      </div>
      <div className='grid grid-cols-2 items-center gap-x-4'>
        <Button prefixIcon={<SendIcon />}>Send</Button>
        <Button prefixIcon={<CornerLeftDownIcon />}>Receive</Button>
      </div>
      <div className='mt-8 border-t border-dashed border-accents-3'>
        {new Array(5).fill(0).map((_, i) => (
          <Transaction date='7/15/2023, 9:15:22 PM' key={i} />
        ))}
      </div>
    </div>
  );
}
