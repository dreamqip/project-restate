'use client';

import type { Product } from '@/app/marketplace/test-product';

import { useAccountNfts } from '@/hooks/use-account-nfts';
import { useLedger } from '@/hooks/use-ledger';
import { useNftSellOffers } from '@/hooks/use-nft-offers';
import { useWallet } from '@/hooks/use-wallet';
import { formatAmount } from '@/lib/format';
import { DialogClose } from '@radix-ui/react-dialog';
import { Label } from '@radix-ui/react-label';
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
  const { wallet } = useWallet();
  const { acceptNFTOffer } = useLedger();

  const { refetchSellOffers, sellOffers } = useNftSellOffers();
  const { refetchNfts } = useAccountNfts();
  const lastOffer = sellOffers[sellOffers.length - 1];

  const onSubmit = async () => {
    //TODO: add loader
    try {
      const response = await acceptNFTOffer({
        NFTokenSellOffer: lastOffer.nft_offer_index,
      });
      refetchNfts();
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
          Accept the offer for {lastOffer && formatAmount(lastOffer.amount)}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm gap-6 border-none bg-transparent p-4 sm:left-32 sm:top-32 sm:translate-x-0 sm:translate-y-0 sm:p-0'>
        <DialogHeader>
          <DialogClose className='mb-2 flex max-w-min items-center justify-start whitespace-nowrap text-accents-3'>
            <ChevronLeftIcon className='mr-1 inline-block h-6 w-6' />
            Back to {product.name}
          </DialogClose>
          <DialogTitle className='!mb-3 !mt-0 text-left text-3xl font-bold'>
            Accept the offer for <br />
            {lastOffer && formatAmount(lastOffer.amount)}
          </DialogTitle>
          <DialogDescription className='text-left text-base'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            maximus nunc bibendum viverra pretium.
          </DialogDescription>
        </DialogHeader>
        <div className='flex gap-2 space-y-0'>
          <Checkbox
            checked={isChecked}
            id='terms'
            onCheckedChange={() => setIsChecked((prev) => !prev)}
          />
          <Label className='cursor-pointer leading-none' htmlFor='terms'>
            By signing a transaction, you understand that it is not reversible
            once it is sent.
          </Label>
        </div>
        <DialogFooter>
          <Button
            className='w-full bg-transparent'
            disabled={!isChecked}
            onClick={onSubmit}
          >
            Sign & send a transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
