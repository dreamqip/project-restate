'use client';

import { Button, Input } from '@/components/ui';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useMnemonics } from '@/hooks/use-mnemonics';
import { generateMnemonic } from 'bip39';
import { CopyIcon, RefreshCwIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateWallet() {
  const router = useRouter();

  const { setMnemonics: setProviderMnemonics } = useMnemonics();

  const [mnemonics, setMnemonics] = useState<string[]>(() =>
    generateMnemonic().split(' '),
  );

  const [_, copy] = useCopyToClipboard();

  const proceedToVerify = () => {
    console.log('mnemonics', mnemonics);
    setProviderMnemonics(mnemonics);
    router.push('/wallet/verify');
  };

  return (
    <div className='mb-4'>
      <p className='mb-4 font-medium'>Mnemonics (consists from 12 words)</p>
      <div className='grid grid-cols-2 gap-4'>
        {mnemonics.map((_, i) => (
          // Read only input
          <Input
            className='text-left'
            key={i}
            readOnly
            value={`${i + 1}. ${mnemonics[i]}`}
          />
        ))}
      </div>
      <div className='my-6 flex items-center justify-center gap-x-4'>
        <Button
          className='p-0 text-base font-normal'
          onClick={() => copy(mnemonics.join(' '))}
          prefixIcon={<CopyIcon />}
          variant='ghost'
        >
          Copy
        </Button>
        <Button
          className='p-0 text-base font-normal'
          onClick={() => setMnemonics(generateMnemonic().split(' '))}
          prefixIcon={<RefreshCwIcon />}
          variant='ghost'
        >
          Regenerate
        </Button>
      </div>
      <Button className='w-full' onClick={proceedToVerify}>
        Verify mnemonics
      </Button>
    </div>
  );
}
