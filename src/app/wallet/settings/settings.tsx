'use client';

import { Button, Checkbox, Input, Label } from '@/components/ui';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useMnemonics } from '@/hooks/use-mnemonics';
import { useWallet } from '@/hooks/use-wallet';
import { padWithLeadingZeros } from '@/lib/utils';
import { CopyIcon } from 'lucide-react';
import { useId, useState } from 'react';
import { toast } from 'sonner';

import RevealModal from './reveal-modal';

export default function Settings() {
  const { signOut } = useWallet();
  const { mnemonics } = useMnemonics();

  const [isRevealed, setIsRevealed] = useState(false);

  const checkboxId = useId();
  const [checked, setChecked] = useState(false);

  const [_, copy] = useCopyToClipboard();

  const handleCopyMnemonics = () => {
    const promise = copy(mnemonics.join(' '));
    toast.promise(promise, {
      error: 'Failed to copy mnemonics',
      loading: 'Copying mnemonics...',
      success: 'Mnemonics copied',
    });
  };

  const handleRemoveWallet = () => {
    try {
      signOut();
      toast.success('Wallet removed');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div>
      <Accordion collapsible type='single'>
        <AccordionItem className='border-0' value='mnemonics'>
          <AccordionTrigger className='py-6 text-warning [&>svg]:h-6 [&>svg]:w-6'>
            Mnemonics
          </AccordionTrigger>
          <AccordionContent className='overflow-visible'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-4'>
                {new Array(6).fill(null).map((_, i) => (
                  <Input
                    prefixIcon={
                      <span className='text-warning'>
                        {padWithLeadingZeros(i + 1, 2)}
                      </span>
                    }
                    value={
                      mnemonics.length && isRevealed
                        ? mnemonics[i]
                        : '*'.repeat(4)
                    }
                    className='text-left text-warning'
                    containerClassName='ring-warning border-warning focus-within:ring-warning'
                    key={i}
                    readOnly
                  />
                ))}
              </div>
              <div className='grid gap-4'>
                {new Array(6).fill(null).map((_, i) => (
                  <Input
                    prefixIcon={
                      <span className='text-warning'>
                        {padWithLeadingZeros(i + 7, 2)}
                      </span>
                    }
                    value={
                      mnemonics.length && isRevealed
                        ? mnemonics[i + 6]
                        : '*'.repeat(4)
                    }
                    className='text-left text-warning'
                    containerClassName='ring-warning border-warning focus-within:ring-warning'
                    key={i}
                    readOnly
                  />
                ))}
              </div>
            </div>
            <div className='my-6 flex items-center justify-center gap-x-4'>
              <Button
                className='p-0 text-base font-normal text-warning'
                disabled={!mnemonics.length || !isRevealed}
                onClick={handleCopyMnemonics}
                prefixIcon={<CopyIcon />}
                variant='ghost'
              >
                Copy
              </Button>
              <RevealModal setIsRevealed={setIsRevealed} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className='flex gap-2 space-y-0'>
        <Checkbox
          onCheckedChange={(checked) =>
            setChecked(checked !== 'indeterminate' && checked)
          }
          checked={checked}
          id={checkboxId}
        />
        <Label className='leading-none' htmlFor={checkboxId}>
          By removing wallet, you understand that you will not be able to
          restore the access to your wallet unless you have written the
          mnemonics on a piece of paper stored in a safe place.{' '}
        </Label>
      </div>
      <Button
        className='mt-6 w-full'
        disabled={!checked || !mnemonics.length}
        onClick={handleRemoveWallet}
        variant='destructive'
      >
        Remove wallet
      </Button>
    </div>
  );
}
