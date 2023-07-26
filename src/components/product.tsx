import type { Product as ProductType } from '@/app/marketplace/test-product';

import { MARKUP_PRODUCT } from '@/app/marketplace/test-product';
import AcceptOfferModal from '@/components/accept-offer-modal';
import CancelOfferModal from '@/components/cancel-offer-modal';
import CreateOfferModal from '@/components/create-offer-modal';
import MintNftModal from '@/components/mint-nft-modal';
import ProductGallery from '@/components/product-gallery';
import Warranty from '@/components/warranty';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';

interface ProductProps {
  product: ProductType;
}

export default function Product({ product }: ProductProps) {
  return (
    <div className='grid gap-8'>
      <div className='max-w-sm'>
        {/* Product name & tagline */}
        <Link className='mb-2 flex items-center text-accents-3' href='./'>
          <ChevronLeftIcon className='mr-1 inline-block h-6 w-6' />
          Back
        </Link>
        <h1 className='mb-3 text-3xl font-bold'>{product.name}</h1>
        <p>{product.tagline}</p>
      </div>
      <ProductGallery images={product.images} />
      <div className='max-w-sm'>
        <MintNftModal product={product} />
        <CreateOfferModal product={product} />
        <CancelOfferModal product={product} />
        <AcceptOfferModal product={MARKUP_PRODUCT} />
        {/* {nftOwner === accountAddress?.address ? (
          nftSellOffers.length > 1 ? (
            <CreateOfferModal product={MARKUP_PRODUCT} />
          ) : (
            <CancelOfferModal
              nftSellOffers={nftSellOffers}
              product={MARKUP_PRODUCT}
            />
          )
        ) : (
          <AcceptOfferModal
            nftSellOffers={nftSellOffers}
            product={MARKUP_PRODUCT}
          />
        )} */}
        <div className='grid gap-8'>
          {/* Warranties */}
          <Warranty warranty={product.warranties[0]} />
          <Warranty warranty={product.warranties[0]} />
        </div>
      </div>
    </div>
  );
}
