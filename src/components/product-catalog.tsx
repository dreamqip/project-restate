import { MARKUP_PRODUCT } from '@/app/marketplace/test-product';
import ProductCard from '@/components/product-card';
import Link from 'next/link';
import React from 'react';

interface ProductCatalogProps {
  content: string;
}

export default function ProductCatalog({ content }: ProductCatalogProps) {
  return (
    <div>
      <div className='mb-8'>
        <h1 className='mb-3 text-3xl font-bold'>{content}</h1>
        <p className='max-w-sm'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus
          nunc bibendum viverra pretium.
        </p>
      </div>
      <div className='grid max-w-max gap-8 xl:grid-cols-2	2xl:grid-cols-3'>
        {/* Offers or Portfolio NTFs */}
        {new Array(12).fill(0).map((_, i) => (
          <Link
            href={content === 'Offers' ? `offers/${i}` : `portfolio/${i}`}
            key={i}
          >
            <ProductCard product={MARKUP_PRODUCT} />
          </Link>
        ))}
      </div>
    </div>
  );
}
