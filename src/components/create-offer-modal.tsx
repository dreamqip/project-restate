'use client';

import type { FullAsset } from '@/types/notion';

import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from '@/components/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useLedger } from '@/hooks/use-ledger';
import { useNftId } from '@/hooks/use-nft-id';
import { useNftSellOffers } from '@/hooks/use-nft-offers';
import { useWallet } from '@/hooks/use-wallet';
import { updateAssetByPageId } from '@/lib/api';
import { toUIError } from '@/lib/error';
import { buildAmount } from '@/lib/transaction';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogClose } from '@radix-ui/react-dialog';
import { ChevronLeftIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

export default function CancelOfferModal({
  fullAsset,
  pageId,
}: {
  fullAsset: FullAsset;
  pageId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createNFTOffer } = useLedger();
  const { wallet } = useWallet();

  const { refetchSellOffers } = useNftSellOffers();
  const { nftId } = useNftId();

  const formSchema = z.object({
    amount: z.string().nonempty(),
    terms: z.boolean().refine((v) => v === true, 'Terms must be accepted'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      amount: '',
      terms: false,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    const promise = createNFTOffer({
      amount: buildAmount(values.amount),
      flags: 1,
      NFTokenID: nftId,
    });

    toast.promise(promise, {
      error: (error) => {
        setIsSubmitting(false);

        const uiError = toUIError(error);
        return uiError.message;
      },
      loading: 'Sending transaction...',
      success: async () => {
        await updateAssetByPageId(pageId, Number(values.amount));

        refetchSellOffers();
        setIsSubmitting(false);

        return 'Offer created successfully!';
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='mb-8 w-full' disabled={!wallet}>
          Create an offer
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm gap-6 border-none bg-transparent p-4 sm:left-32 sm:top-32 sm:translate-x-0 sm:translate-y-0 sm:p-0'>
        <DialogHeader>
          <DialogClose className='mb-2 flex max-w-min items-center justify-start whitespace-nowrap text-accents-3'>
            <ChevronLeftIcon className='mr-1 inline-block h-6 w-6' />
            Back to {fullAsset.title}
          </DialogClose>
          <DialogTitle className='!mb-3 !mt-0 text-left text-3xl font-bold'>
            {fullAsset.title}
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
                <FormItem className='[&>*]:bg-transparent'>
                  {/* We need to show to the user word id in human readable format, so we add 1 to the index */}
                  <FormLabel>Sale Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className='bg-transparent'
                      disabled={isSubmitting}
                    />
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
                      disabled={isSubmitting}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='cursor-pointer font-normal leading-none'>
                    By creating an offer for the product you own, you understand
                    that you will not be able to return it once it is bought,
                    but you can cancel the offer before that.
                  </FormLabel>
                </FormItem>
              )}
              control={form.control}
              name='terms'
            />
            <div>
              <Button
                className='w-full bg-transparent'
                disabled={!form.formState.isValid || isSubmitting}
                type='submit'
              >
                Sign & send a transaction
              </Button>
              <p className='!ml-0 mt-4 text-accents-3'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
