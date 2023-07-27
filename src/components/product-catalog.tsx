'use client';

import type { Asset } from '@/types/notion';

import ProductCard from '@/components/product-card';
import Link from 'next/link';

interface ProductCatalogProps {
  assets: Asset[];
  content: string;
}

export default function ProductCatalog({
  assets,
  content,
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
        {assets.map((asset, index) => (
          <Link
            href={content === 'Offers' ? `offers/${123}` : `portfolio/${123}`}
            key={index}
          >
            <ProductCard asset={asset} />
          </Link>
        ))}
      </div>
    </div>
  );
}
