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
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  password: z.string().nonempty(),
  securityTerms: z
    .boolean()
    .refine((v) => v === true, 'Terms must be accepted'),
});

export default function Login() {
  const router = useRouter();
  const { signIn } = useWallet();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      password: '',
      securityTerms: false,
    },
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      signIn(values.password);
      router.push('/wallet');
    } catch (error) {
      if (error instanceof Error) {
        form.control.setError('password', { message: error.message });
      }

      return;
    }
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
            <FormItem className='flex gap-2 space-y-0'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className='leading-none'>
                By unlocking the wallet, you confirm that no one saw your
                password because you may lose all your assets if the password
                was revealed.
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
          Unlock the wallet
        </Button>
      </form>
    </Form>
  );
}
