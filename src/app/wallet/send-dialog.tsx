import { Button, Checkbox, Input } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useLedger } from '@/hooks/use-ledger';
import { toUIError } from '@/lib/error';
import { buildAmount } from '@/lib/transaction';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogClose } from '@radix-ui/react-dialog';
import { ChevronLeftIcon, SendIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { isValidAddress } from 'xrpl';
import * as z from 'zod';

export default function SendDialog({
  accountExists,
  address,
}: {
  accountExists: boolean;
  address: string;
}) {
  const { sendPayment } = useLedger();

  const formSchema = useMemo(() => {
    return z.object({
      // Parse the string to a number
      amount: z.string().refine((v) => {
        const parsed = Number(v);
        return !isNaN(parsed) && parsed > 0;
      }),
      confirm: z.boolean().refine((v) => v === true),
      recipient: z.string().refine((v) => isValidAddress(v) && v !== address),
    });
  }, [address]);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      amount: '',
      confirm: false,
      recipient: '',
    },
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const promise = sendPayment({
      amount: buildAmount(values.amount),
      destination: values.recipient,
    });

    toast.promise(promise, {
      error: (error) => {
        const uiError = toUIError(error);
        return uiError.message;
      },
      loading: 'Sending transaction...',
      success: 'Transaction sent!',
    });

    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={!accountExists} prefixIcon={<SendIcon />}>
          Send
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm gap-6 border-none bg-transparent p-0 sm:left-32 sm:top-32 sm:translate-x-0 sm:translate-y-0'>
        <DialogHeader>
          <DialogClose className='mb-2 flex max-w-min items-center justify-start whitespace-nowrap text-accents-3'>
            <ChevronLeftIcon className='mr-1 inline-block h-6 w-6' />
            Back to XRPL Wallet
          </DialogClose>
          <DialogTitle className='!mb-3 !mt-0 text-left text-3xl font-bold'>
            Send XRP
          </DialogTitle>
          <DialogDescription className='text-left text-base'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            maximus nunc bibendum viverra pretium.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className='mb-4 grid gap-y-6'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='rLdTj3dThvpQ5nxiqqm9fKn9i72xg6jwcq'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='recipient'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder='777' {...field} />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='amount'
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
                    By signing a transaction, you understand that it is not
                    reversible once it is sent.
                  </FormLabel>
                </FormItem>
              )}
              control={form.control}
              name='confirm'
            />
            <DialogFooter>
              <Button
                className='w-full bg-transparent'
                disabled={!form.formState.isValid}
                type='submit'
              >
                Sign & send a transaction
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
