'use client';

import type { Asset } from '@/types/notion';

import AssetCard from '@/components/asset-card';
import Link from 'next/link';

interface AssetCatalogProps {
  assets: Asset[];
  content: string;
}

export default function AssetCatalog({ assets, content }: AssetCatalogProps) {
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
            <AssetCard asset={asset} />
          </Link>
        ))}
      </div>
    </div>
  );
}
