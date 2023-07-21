'use client';

import { Button, Checkbox, Input } from '@/components/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useMnemonics } from '@/hooks/use-mnemonics';
import { mnemonicsToSeed } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Generate random number in range
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function VerifyMnemonics() {
  const { mnemonics: mnemonics } = useMnemonics();
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

    console.log('seed', mnemonicsToSeed(mnemonics.join(' ')));
  }

  return (
    <div className='max-w-sm'>
      <div className='mb-6'>
        <Link
          className='mb-1 flex items-center text-accents-3'
          href='/wallet/create'
        >
          <ChevronLeftIcon className='mr-1 inline-block h-6 w-6' />
          Back to Create a new wallet
        </Link>
        <h1 className='mb-3 text-3xl font-bold'>Verify mnemonics</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus
          nunc bibendum viverra pretium.
        </p>
      </div>
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
                <FormLabel className='leading-none'>
                  {/* TODO: A bit confusing code, need to refactor it if possible */}
                  By creating a new wallet, you agree with Restate&apos;s{' '}
                  <Link className='text-cyan' href='/terms'>
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link className='text-cyan' href='/privacy'>
                    Privacy Policy
                  </Link>
                  .
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
    </div>
  );
}
