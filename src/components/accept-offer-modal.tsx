'use client';

import type { Product } from '@/app/marketplace/test-product';

import { DialogClose } from '@radix-ui/react-dialog';
import { ChevronLeftIcon } from 'lucide-react';
import { useState } from 'react';

import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui';

interface AcceptOfferModalProps {
  product: Product;
}
export default function AcceptOfferModal({ product }: AcceptOfferModalProps) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='mb-8 w-full'>
          Accept the offer for {product.price}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm gap-6 border-none bg-transparent p-4 sm:left-32 sm:top-32 sm:translate-x-0 sm:translate-y-0 sm:p-0'>
        <DialogHeader>
          <DialogClose className='mb-2 flex max-w-min items-center justify-start whitespace-nowrap text-accents-3'>
            <ChevronLeftIcon className='mr-1 inline-block h-6 w-6' />
            Back to {product.name}
          </DialogClose>
          <DialogTitle className='!mb-3 !mt-0 text-left text-3xl font-bold'>
            Accept the offer for <br /> {product.price}
          </DialogTitle>
          <DialogDescription className='text-left text-base'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            maximus nunc bibendum viverra pretium.
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-baseline gap-2'>
          <Checkbox
            checked={isChecked}
            id='transactionAgreement'
            onCheckedChange={() => setIsChecked((prev) => !prev)}
          />
          <label className='cursor-pointer' htmlFor='transactionAgreement'>
            By signing a transaction, you understand that it is not reversible
            once it is sent.
          </label>
        </div>
        <DialogFooter>
          <Button className='w-full bg-transparent' disabled={!isChecked}>
            Sign & send a transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
