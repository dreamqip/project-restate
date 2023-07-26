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
import { zodResolver } from '@hookform/resolvers/zod';
import { validateMnemonic } from 'bip39';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Wallet } from 'xrpl';
import * as z from 'zod';

const formSchema = z.object({
  mnemonics: z.string().refine((v) => {
    return validateMnemonic(v);
  }),
  terms: z.boolean().refine((v) => v === true),
});

export default function ImportWallet() {
  const router = useRouter();
  const { setWallet } = useWallet();
  const { setMnemonics } = useMnemonics();

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
    setMnemonics(values.mnemonics.split(' '));
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
                <TermsAndPrivacyLinks />
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
