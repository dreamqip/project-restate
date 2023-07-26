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
import { saveMnemonics } from '@/lib/mnemonics';
import { saveWallet } from '@/lib/wallet';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z
  .object({
    confirmPassword: z.string(),
    password: z.string().min(8),
    securityTerms: z.boolean().refine((v) => v === true),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function SetPassword() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      confirmPassword: '',
      password: '',
      securityTerms: false,
    },
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  // Get wallet and mnemonics from context
  const { wallet } = useWallet();
  const { mnemonics } = useMnemonics();

  // Show password state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Form submit handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!wallet || !mnemonics) {
      toast.error('Wallet or mnemonics not found. Please try again.');
      return;
    }

    // Save wallet and mnemonics to storage
    saveWallet(wallet, values.password);
    saveMnemonics(mnemonics.join(' '), values.password);
    router.replace('/wallet');
  };

  return (
    <Form {...form}>
      <form
        className='mb-4 grid gap-y-6'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  suffixIcon={
                    showPassword ? (
                      <EyeIcon
                        className='cursor-pointer'
                        onClick={toggleShowPassword}
                      />
                    ) : (
                      <EyeOffIcon
                        className='cursor-pointer'
                        onClick={toggleShowPassword}
                      />
                    )
                  }
                  placeholder='*****'
                  type={showPassword ? 'text' : 'password'}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
          control={form.control}
          name='password'
        />
        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  suffixIcon={
                    showConfirmPassword ? (
                      <EyeIcon
                        className='cursor-pointer'
                        onClick={toggleShowConfirmPassword}
                      />
                    ) : (
                      <EyeOffIcon
                        className='cursor-pointer'
                        onClick={toggleShowConfirmPassword}
                      />
                    )
                  }
                  placeholder='*****'
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
          control={form.control}
          name='confirmPassword'
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
                By setting the password, you understand that if you forgot the
                password or you want to change it, you need to reimport the
                wallet using mnemonics you have written on a piece of paper
                stored in a safe place.
              </FormLabel>
            </FormItem>
          )}
          control={form.control}
          name='securityTerms'
        />
        <Button
          className='w-full'
          disabled={!form.formState.isValid}
          type='submit'
        >
          Set the password
        </Button>
      </form>
    </Form>
  );
}
