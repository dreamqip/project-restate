'use client';

import type { FullAsset } from '@/types/notion';

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
  Label,
} from '@/components/ui';
import { useLedger } from '@/hooks/use-ledger';
import { useNftSellOffers } from '@/hooks/use-nft-offers';
import { useWallet } from '@/hooks/use-wallet';
import { updateAssetByPageId } from '@/lib/api';
import { toUIError } from '@/lib/error';
import { DialogClose } from '@radix-ui/react-dialog';
import { ChevronLeftIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CancelOfferModal({
  fullAsset,
  pageId,
}: {
  fullAsset: FullAsset;
  pageId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const { wallet } = useWallet();
  const { cancelNFTOffer } = useLedger();

  const { refetchSellOffers, sellOffers } = useNftSellOffers();
  const lastOffer = sellOffers[sellOffers.length - 1];

  const onSubmit = async () => {
    setIsSubmitting(true);

    const promise = cancelNFTOffer({
      NFTokenOffers: [lastOffer.nft_offer_index],
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

        refetchSellOffers();
        setIsSubmitting(false);

        return 'Offer cancelled successfully!';
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='mb-8 w-full' disabled={!wallet} variant='warning'>
          Cancel the offer
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm gap-6 border-none bg-transparent p-4 sm:left-32 sm:top-32 sm:translate-x-0 sm:translate-y-0 sm:p-0'>
        <DialogHeader>
          <DialogClose className='mb-2 flex max-w-min items-center justify-start whitespace-nowrap text-accents-3'>
            <ChevronLeftIcon className='mr-1 inline-block h-6 w-6' />
            Back to {fullAsset.title}
          </DialogClose>
          <DialogTitle className='!mb-3 !mt-0 text-left text-3xl font-bold'>
            Cancel the offer
          </DialogTitle>
          <DialogDescription className='text-left text-base'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            maximus nunc bibendum viverra pretium.
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
            variant='destructive'
          >
            Sign & send a transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
