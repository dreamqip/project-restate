'use client';

import TermsAndPrivacyLinks from '@/components/terms-and-privacy-links';
import { Button, Checkbox, Input } from '@/components/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useMnemonics } from '@/hooks/use-mnemonics';
import { useWallet } from '@/hooks/use-wallet';
import { mnemonicsToSeed } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Wallet } from 'xrpl';
import * as z from 'zod';

// Generate random number in range
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function VerifyMnemonics() {
  const { mnemonics: mnemonics } = useMnemonics();
  const { setWallet } = useWallet();

  const router = useRouter();

  const [randomMnemonicIndex, setRandomMnemonicIndex] = useState<number>(0);

  // Set random mnemonic index on first client render
  useEffect(() => {
    setRandomMnemonicIndex(randomInRange(0, 11));
  }, []);

  console.log('mnemonics', mnemonics);

  // Wrap the form schema in useMemo to avoid re-creating it on every render.
  const formSchema = useMemo(() => {
    return z.object({
      // Accept only one of the mnemonics from the list
      mnemonic: z.literal(mnemonics[randomMnemonicIndex]),
      // Accept only true value
      terms: z.boolean().refine((v) => v === true),
    });
  }, [mnemonics, randomMnemonicIndex]);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      mnemonic: '',
      terms: false,
    },
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const wallet = Wallet.fromSeed(mnemonicsToSeed(mnemonics.join(' ')));
    console.log('wallet', wallet);

    setWallet(wallet);
    router.push('/wallet/set-password');
  }

  return (
    <Form {...form}>
      <form
        className='mb-4 grid gap-y-6'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          render={({ field }) => (
            <FormItem>
              {/* We need to show to the user word id in human readable format, so we add 1 to the index */}
              <FormLabel>Word #{randomMnemonicIndex + 1}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
          control={form.control}
          name='mnemonic'
        />
        <FormField
          render={({ field }) => (
            <FormItem className='flex gap-2 space-y-0'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className='font-normal leading-none'>
                By creating a new wallet, you agree with Restate&apos;s{' '}
                <TermsAndPrivacyLinks />
              </FormLabel>
            </FormItem>
          )}
          control={form.control}
          name='terms'
        />
        <Button
          className='w-full'
          disabled={!form.formState.isValid}
          type='submit'
        >
          Create a new wallet
        </Button>
      </form>
    </Form>
  );
}
