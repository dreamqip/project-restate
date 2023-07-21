'use client';

import { Button, Checkbox, Input } from '@/components/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z
  .object({
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    password: z.string(),
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className='max-w-sm'>
      <div className='mb-6'>
        <h1 className='mb-3 text-3xl font-bold'>Set a password</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus
          nunc bibendum viverra pretium.
        </p>
      </div>
      
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            console.log(values);
          })}
          className='mb-4 grid gap-y-6'
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
            Create a new wallet
          </Button>
        </form>
      </Form>
    </div>
  );
}
