import { Button, Checkbox, Input } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useWallet } from '@/hooks/use-wallet';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogClose } from '@radix-ui/react-dialog';
import { ChevronLeftIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  password: z.string().min(8),
  securityTerms: z.boolean().refine((v) => v === true),
});

export default function RevealModal() {
  const { signIn } = useWallet();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      password: '',
      securityTerms: false,
    },
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  // Dialog state
  const [open, setOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      signIn(values.password);

      // Close the dialog
      setOpen(false);

      // Reset the form
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Password you entered is incorrect');
        // Set the password field as invalid
        form.setError('password', {});
      }
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          className='p-0 text-base font-normal text-warning'
          prefixIcon={<EyeIcon />}
          variant='ghost'
        >
          Reveal
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm border-none bg-transparent p-0 pb-8 sm:left-32 sm:top-32 sm:translate-x-0 sm:translate-y-0'>
        <DialogHeader>
          <DialogClose className='mb-2 flex max-w-min items-center justify-start whitespace-nowrap text-accents-3'>
            <ChevronLeftIcon className='mr-1 inline-block h-6 w-6' />
            Back to Settings
          </DialogClose>
          <DialogTitle className='!mb-3 !mt-0 text-left text-3xl font-bold'>
            Reveal mnemonics
          </DialogTitle>
          <DialogDescription className='text-left text-base'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            maximus nunc bibendum viverra pretium.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className='grid gap-y-6' onSubmit={form.handleSubmit(onSubmit)}>
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
                    password because you may lose all your assets if the
                    password was revealed.
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
              Reveal mnemonics
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
