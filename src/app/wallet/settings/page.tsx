import Settings from './settings';

export default function Page() {
  return (
    <div className='max-w-sm'>
      <div className='mb-6'>
        <h1 className='mb-3 text-3xl font-bold'>Settings</h1>
        <p>
          Your wallet, your way: tailor settings, reveal mnemonics, or import a
          new wallet.
        </p>
      </div>
      <Settings />
    </div>
  );
}
