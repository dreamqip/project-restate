import Link from 'next/link';

import CreateWallet from './create-wallet';

export default function Page() {
  return (
    <div className='max-w-sm'>
      <div className='mb-6'>
        <h1 className='mb-3 text-3xl font-bold'>Create a new wallet</h1>
        <p>Start your tokenized voyage: shape a wallet for success.</p>
      </div>
      <CreateWallet />
      <p className='text-accents-3'>
        Already have an XRPL wallet?{' '}
        <Link className='font-medium text-foreground' href='/wallet/import'>
          Import an existing wallet.
        </Link>
      </p>
    </div>
  );
}
