'use client';

import type { Asset, Offer } from '@/types/notion';

import AssetCard from '@/components/asset-card';
import Link from 'next/link';

interface AssetCatalogProps {
  assets: (Asset & { nftId: Offer['nftId']; price: Offer['price'] })[];
  content: string;
}

export default function AssetCatalog({ assets, content }: AssetCatalogProps) {
  return (
    <div>
      <div className='mb-8'>
        <h1 className='mb-3 text-3xl font-bold'>{content}</h1>
        <p className='max-w-sm'>
          {content === 'Offers'
            ? 'Unveil market potential: explore and embrace available offers.'
            : 'Visualize your wealth: a comprehensive view of your assets.'}
        </p>
      </div>
      <div className='grid max-w-max gap-8 xl:grid-cols-2	2xl:grid-cols-3'>
        {assets.map((asset, index) => {
          const { nftId, ...rest } = asset;
          return (
            <Link
              href={
                content === 'Offers' ? `offers/${nftId}` : `portfolio/${nftId}`
              }
              // Make sure to use a unique key for each item
              key={`asset-${nftId}-${index}`}
            >
              <AssetCard asset={rest} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
