'use client';

import type { Product } from '@/app/marketplace/test-product';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui';
import { useLedger } from '@/hooks/use-ledger';
import { useWallet } from '@/hooks/use-wallet';
import { DialogClose } from '@radix-ui/react-dialog';
import { ChevronLeftIcon } from 'lucide-react';

interface MintNftModalProps {
  product: Product;
}
export default function MintNftModal({ product }: MintNftModalProps) {
  const { mintNFT } = useLedger();
  const { wallet } = useWallet();

  const onSubmit = async () => {
    //TODO: add loader
    try {
      const response = await mintNFT({
        flags: 8,
        NFTokenTaxon: 1,
        transferFee: 500,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='mb-8 w-full' disabled={!wallet}>
          Mint NFT
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
            The result is in console
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button className='w-full bg-transparent' onClick={onSubmit}>
            Mint NFT
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
