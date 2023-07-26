import Link from 'next/link';

export default function TermsAndPrivacyLinks() {
  return (
    <>
      <Link className='text-cyan' href='/terms'>
        Terms & Conditions
      </Link>
      {' and '}
      <Link className='text-cyan' href='/privacy'>
        Privacy Policy
      </Link>
    </>
  );
}
