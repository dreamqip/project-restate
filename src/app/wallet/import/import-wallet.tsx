'use client';

import { Button, Checkbox, Input } from '@/components/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useWallet } from '@/hooks/use-wallet';
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
  const router = useRouter();
  const { setWallet } = useWallet();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      mnemonics: '',
      terms: false,
    },
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In future versions of xrpl.js, Wallet.fromMnemonic will be removed.
    // For that case, we will need to use Wallet.fromSeed(mnemonicsToSeed(values.mnemonics))
    const wallet = Wallet.fromMnemonic(values.mnemonics);

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
              <FormLabel className='font-normal leading-none'>
                By importing an existing wallet, you agree with Restate&apos;s{' '}
                <Link className='text-cyan' href='/terms'>
                  Terms & Conditions
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
