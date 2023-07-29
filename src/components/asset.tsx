'use client';

import type { FullAsset } from '@/types/notion';

import AcceptOfferModal from '@/components/accept-offer-modal';
import AssetGallery from '@/components/asset-gallery';
import CancelOfferModal from '@/components/cancel-offer-modal';
import CreateOfferModal from '@/components/create-offer-modal';
import Warranty from '@/components/warranty';
import { useNftSellOffers } from '@/hooks/use-nft-offers';
import { useNftOwner } from '@/hooks/use-nft-owner';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';

export default function Asset({ asset }: { asset: FullAsset }) {
  const { isOwner } = useNftOwner();
  const { sellOffers } = useNftSellOffers();

  return (
    <div className='grid gap-8'>
      <div className='max-w-sm'>
        {/* Product name & tagline */}
        <Link className='mb-2 flex items-center text-accents-3' href='./'>
          <ChevronLeftIcon className='mr-1 inline-block h-6 w-6' />
          Back
        </Link>
        <h1 className='mb-3 text-3xl font-bold'>{asset.title}</h1>
        <p>{asset.subtitle}</p>
      </div>
      <AssetGallery images={asset.images} />
      <div className='max-w-sm'>
        {sellOffers.length ? (
          isOwner ? (
            <CancelOfferModal asset={asset} />
          ) : (
            <AcceptOfferModal asset={asset} />
          )
        ) : (
          isOwner && <CreateOfferModal asset={asset} />
        )}

        <div className='grid gap-8'>
          {/* Warranties */}
          {asset.warranties.map((warranty, index) => (
            <Warranty index={index} key={index} warranty={warranty} />
          ))}
        </div>
      </div>
    </div>
  );
}
