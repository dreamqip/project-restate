import type { Asset, Offer } from '@/types/notion';

import { shimmer, toBase64 } from '@/lib/shimmer';

import ImageLegacyWithFallback from './fallback-image';

export default function AssetCard({
  asset,
}: {
  asset: Asset & { price: Offer['price'] };
}) {
  return (
    <div className='grid max-w-sm gap-4'>
      <ImageLegacyWithFallback
        blurDataURL={`data:image/svg+xml;base64,${toBase64(
          shimmer(Number(384), Number(384)),
        )}`}
        alt='product image'
        className='h-96 w-full max-w-sm object-cover'
        height={384}
        placeholder='blur'
        src={asset.image || 'https://picsum.photos/384'}
        width={384}
      />
      <div className='flex justify-between'>
        <div className='grid'>
          <span className='font-medium text-accents-3'>Product Name</span>
          <span>{asset.title}</span>
        </div>
        {asset.price && (
          <div className='grid text-right'>
            <span className='font-medium text-accents-3'>Sale Price</span>
            <span>{asset.price} XRP</span>
          </div>
        )}
      </div>
      <p className='text-accents-1'>{asset.subtitle}</p>
    </div>
  );
}
