import Link from 'next/link';

import Login from './login';

export default function Page() {
  return (
    <div className='max-w-sm'>
      <div className='mb-6'>
        <h1 className='mb-3 text-3xl font-bold'>Unlock the wallet</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus
          nunc bibendum viverra pretium.
        </p>
      </div>
      <Login />
      <span aria-label='Forgot or want to change the password?'>
        <span className='text-accents-3'>
          Forgot or want to change the password?
        </span>{' '}
        <Link href='/wallet/import'>
          Import your wallet again and set a new password.
        </Link>
      </span>
    </div>
  );
}
