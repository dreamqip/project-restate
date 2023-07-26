import type { Product } from '@/app/marketplace/test-product';

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
import { useNftSellOffers } from '@/hooks/use-nft-offers';
import { useWallet } from '@/hooks/use-wallet';
import { buildAmount } from '@/lib/transaction';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogClose } from '@radix-ui/react-dialog';
import { ChevronLeftIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface CreateOfferModalProps {
  product: Product;
}
export default function CreateOfferModal({ product }: CreateOfferModalProps) {
  const { createNFTOffer } = useLedger();
  const { wallet } = useWallet();

  const { refetchSellOffers } = useNftSellOffers();

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
    //TODO: add loader
    try {
      const response = await createNFTOffer({
        amount: buildAmount(values.amount),
        flags: 1,
        NFTokenID: product.nftId,
      });

      refetchSellOffers();
      console.log(response);
    } catch (error) {
      console.error(error);
    }
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
            Back to {product.name}
          </DialogClose>
          <DialogTitle className='!mb-3 !mt-0 text-left text-3xl font-bold'>
            {product.name}
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
                  {/* We need to show to the user word id in human readable format, so we add 1 to the index */}
                  <FormLabel>Sale Price</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel className='font-normal leading-none'>
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
                disabled={!form.formState.isValid}
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
