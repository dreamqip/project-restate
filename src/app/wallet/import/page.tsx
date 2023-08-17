import Link from 'next/link';

import ImportWallet from './import-wallet';

export default function Page() {
  return (
    <div className='max-w-sm'>
      <div className='mb-6'>
        <h1 className='mb-3 text-3xl font-bold'>Import an existing wallet</h1>
        <p>Empowering your move: import your wallet and embrace change.</p>
      </div>
      <ImportWallet />
      <p className='text-accents-3'>
        Do not have an XRPL wallet?{' '}
        <Link className='font-medium text-foreground' href='/wallet/create'>
          Create a new wallet
        </Link>
      </p>
    </div>
  );
}
