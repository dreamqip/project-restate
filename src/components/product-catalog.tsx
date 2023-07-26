'use client';

import { type Product } from '@/app/marketplace/test-product';
import ProductCard from '@/components/product-card';
import Link from 'next/link';
import React from 'react';

interface ProductCatalogProps {
  content: string;
  products: Product[];
}

export default function ProductCatalog({
  content,
  products,
}: ProductCatalogProps) {
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
        {/* Products */}
        {products.map((product, index) => (
          <Link
            href={
              content === 'Offers'
                ? `offers/${product.nftId}`
                : `portfolio/${product.nftId}`
            }
            key={index}
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
}
