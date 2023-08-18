'use client';

import type { FullAsset } from '@/types/notion';

import { useAccountNfts } from '@/hooks/use-account-nfts';
import { useLedger } from '@/hooks/use-ledger';
import { useNftSellOffers } from '@/hooks/use-nft-offers';
import { useWallet } from '@/hooks/use-wallet';
import { updateAssetByPageId } from '@/lib/api';
import { toUIError } from '@/lib/error';
import { formatAmount } from '@/lib/format';
import { DialogClose } from '@radix-ui/react-dialog';
import { Label } from '@radix-ui/react-label';
import { ChevronLeftIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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

export default function AcceptOfferModal({
  fullAsset,
  pageId,
}: {
  fullAsset: FullAsset;
  pageId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const { wallet } = useWallet();
  const { acceptNFTOffer } = useLedger();

  const { refetchSellOffers, sellOffers } = useNftSellOffers();
  const { refetchNfts } = useAccountNfts();
  const lastOffer = sellOffers[sellOffers.length - 1];

  const onSubmit = async () => {
    setIsSubmitting(true);

    const promise = acceptNFTOffer({
      NFTokenSellOffer: lastOffer.nft_offer_index,
    });

    toast.promise(promise, {
      error: (error) => {
        setIsSubmitting(false);

        const uiError = toUIError(error);
        return uiError.message;
      },
      loading: 'Sending transaction...',
      success: async () => {
        await updateAssetByPageId(pageId, 0);

        refetchNfts();
        refetchSellOffers();
        setIsSubmitting(false);

        return 'Congratulations! Offer accepted.';
      },
    });
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
          <DialogClose className='mb-2 flex items-center text-accents-3'>
            <ChevronLeftIcon className='mr-1 inline-block h-6 w-6' />
            <span className='max-w-sm truncate'>Back to {fullAsset.title}</span>
          </DialogClose>
          <DialogTitle className='!mb-3 !mt-0 text-left text-3xl font-bold'>
            Accept the offer for <br />
            {lastOffer && formatAmount(lastOffer.amount)}
          </DialogTitle>
          <DialogDescription className='text-left text-base'>
            Opportunity unlocked: accept and amplify your asset strategy.
          </DialogDescription>
        </DialogHeader>
        <div className='flex gap-2 space-y-0'>
          <Checkbox
            checked={isChecked}
            disabled={isSubmitting}
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
            disabled={!isChecked || isSubmitting}
            onClick={onSubmit}
          >
            Sign & send a transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
