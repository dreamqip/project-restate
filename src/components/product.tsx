import type { Product as ProductType } from '@/app/marketplace/test-product';

import { MARKUP_PRODUCT } from '@/app/marketplace/test-product';
import AcceptOfferModal from '@/components/accept-offer-modal';
import CancelOfferModal from '@/components/cancel-offer-modal';
import CreateOfferModal from '@/components/create-offer-modal';
import ProductGallery from '@/components/product-gallery';
import Warranty from '@/components/warranty';
import { useNftSellOffers } from '@/hooks/use-nft-offers';
import { useNftOwner } from '@/hooks/use-nft-owner';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';

interface ProductProps {
  categoryType: 'Offers' | 'Portfolio';
  product: ProductType;
}

export default function Product({ categoryType, product }: ProductProps) {
  const { isOwner } = useNftOwner();
  const { sellOffers } = useNftSellOffers();

  return (
    <div className='grid gap-8'>
      <div className='max-w-sm'>
        {/* Product name & tagline */}
        <Link className='mb-2 flex items-center text-accents-3' href='./'>
          <ChevronLeftIcon className='mr-1 inline-block h-6 w-6' />
          Back to {categoryType}
        </Link>
        <h1 className='mb-3 text-3xl font-bold'>{product.name}</h1>
        <p>{product.tagline}</p>
      </div>
      <ProductGallery images={product.images} />
      <div className='max-w-sm'>
        {sellOffers.length ? (
          isOwner ? (
            <CancelOfferModal product={product} />
          ) : (
            <AcceptOfferModal product={MARKUP_PRODUCT} />
          )
        ) : (
          isOwner && <CreateOfferModal product={product} />
        )}

        <div className='grid gap-8'>
          {/* Warranties */}
          <Warranty warranty={product.warranties[0]} />
          <Warranty warranty={product.warranties[0]} />
        </div>
      </div>
    </div>
  );
}
