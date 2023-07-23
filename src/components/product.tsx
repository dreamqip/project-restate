import { MARKUP_PRODUCT } from '@/app/marketplace/test-product';
import ProductGallery from '@/components/product-gallery';
import Warranty from '@/components/warranty';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';

import AcceptOfferModal from './accept-offer-modal';

export default function Product() {
  return (
    <div className='grid gap-8'>
      <div className='max-w-sm'>
        {/* Product name & tagline */}
        <Link className='mb-2 flex items-center text-accents-3' href='./'>
          <ChevronLeftIcon className='mr-1 inline-block h-6 w-6' />
          Back to Offers
        </Link>
        <h1 className='mb-3 text-3xl font-bold'>{MARKUP_PRODUCT.name}</h1>
        <p>{MARKUP_PRODUCT.tagline}</p>
      </div>
      <ProductGallery images={MARKUP_PRODUCT.images} />
      <div className='max-w-sm'>
        <AcceptOfferModal product={MARKUP_PRODUCT} />
        <div className='grid gap-8'>
          {/* Warranties */}
          <Warranty warranty={MARKUP_PRODUCT.warranties[0]} />
          <Warranty warranty={MARKUP_PRODUCT.warranties[0]} />
        </div>
      </div>
    </div>
  );
}
