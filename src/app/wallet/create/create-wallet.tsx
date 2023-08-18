'use client';

import { Button, Input } from '@/components/ui';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useMnemonics } from '@/hooks/use-mnemonics';
import { padWithLeadingZeros } from '@/lib/utils';
import { generateMnemonic } from 'bip39';
import { CopyIcon, RefreshCwIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CreateWallet() {
  const router = useRouter();

  const { setMnemonics: setProviderMnemonics } = useMnemonics();

  const [mnemonics, setMnemonics] = useState<string[]>(() =>
    generateMnemonic().split(' '),
  );

  const [_, copy] = useCopyToClipboard();

  const handleCopyMnemonics = () => {
    const promise = copy(mnemonics.join(' '));
    toast.promise(promise, {
      error: 'Failed to copy mnemonics',
      loading: 'Copying mnemonics...',
      success: 'Copied mnemonics to clipboard',
    });
  };

  const proceedToVerify = () => {
    setProviderMnemonics(mnemonics);
    router.push('/wallet/verify');
  };

  return (
    <div className='mb-4'>
      <p className='mb-4 font-medium'>Mnemonics (consists from 12 words)</p>
      <div className='grid grid-cols-2 gap-4'>
        <div className='grid gap-4'>
          {mnemonics.slice(0, 6).map((mnemonic, i) => (
            <Input
              className='text-left'
              key={`${mnemonic}-${i}`}
              prefixIcon={<span>{padWithLeadingZeros(i + 1, 2)}</span>}
              readOnly
              type='text'
              value={mnemonic}
            />
          ))}
        </div>
        <div className='grid gap-4'>
          {mnemonics.slice(6, 12).map((mnemonic, i) => (
            <Input
              className='text-left'
              key={`${mnemonic}-${i}`}
              prefixIcon={<span>{padWithLeadingZeros(i + 7, 2)}</span>}
              readOnly
              type='text'
              value={mnemonic}
            />
          ))}
        </div>
      </div>
      <div className='my-6 flex items-center justify-center gap-x-4'>
        <Button
          className='p-0 text-base font-normal'
          onClick={handleCopyMnemonics}
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
