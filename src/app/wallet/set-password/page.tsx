import SetPassword from './set-password';

export default function Page() {
  return (
    <div className='max-w-sm'>
      <div className='mb-6'>
        <h1 className='mb-3 text-3xl font-bold'>Set a password</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus
          nunc bibendum viverra pretium.
        </p>
      </div>
      <SetPassword />
    </div>
  );
}
