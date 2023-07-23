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
import { useWallet } from '@/hooks/use-wallet';
import { mnemonicsToSeed } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { validateMnemonic } from 'bip39';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Wallet } from 'xrpl';
import * as z from 'zod';

const formSchema = z.object({
  mnemonics: z.string().refine((v) => {
    return validateMnemonic(v);
  }, 'Invalid mnemonics'),
  terms: z.boolean().refine((v) => v === true, 'Terms must be accepted'),
});

export default function ImportWallet() {
  const { mnemonics: mnemonics } = useMnemonics();
  const { setWallet } = useWallet();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      mnemonics: '',
      terms: false,
    },
    mode: 'onChange',
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
              <FormLabel>Mnemonics</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
          control={form.control}
          name='mnemonics'
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
                By creating a new wallet, you agree with Restate&apos;s{' '}
                <Link className='text-cyan' href='/terms'>
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link className='text-cyan' href='/privacy'>
                  Privacy Policy
                </Link>
              </FormLabel>
            </FormItem>
          )}
          control={form.control}
          name='terms'
        />
        <Button className='w-full' disabled={!form.formState.isValid}>
          Import an existing wallet
        </Button>
      </form>
    </Form>
  );
}
