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
import { saveWallet } from '@/lib/wallet';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z
  .object({
    confirmPassword: z.string(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    securityTerms: z
      .boolean()
      .refine((v) => v === true, 'Terms must be accepted'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function SetPassword() {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      confirmPassword: '',
      password: '',
      securityTerms: false,
    },
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const { wallet } = useWallet();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!wallet) {
      console.error('Wallet is not defined');
      return;
    }

    saveWallet(wallet, values.password);
    router.push('/wallet');
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
