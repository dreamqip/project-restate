import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';

import VerifyMnemonics from './verify-mnemonics';

export default function Page() {
  return (
    <div className='max-w-sm'>
      <div className='mb-6'>
        <Link
          className='mb-1 flex items-center text-accents-3'
          href='/wallet/create'
        >
          <ChevronLeftIcon className='mr-1 inline-block h-6 w-6' />
          Back to Create a new wallet
        </Link>
        <h1 className='mb-3 text-3xl font-bold'>Verify mnemonics</h1>
        <p>Confirm mnemonics to ensure secure access.</p>
      </div>
      <VerifyMnemonics />
    </div>
  );
}
