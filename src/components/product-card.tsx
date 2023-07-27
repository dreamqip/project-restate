import type { Asset } from '@/types/notion';

import Image from 'next/image';

export default function ProductCard({ asset }: { asset: Asset }) {
  return (
    <div className='grid max-w-sm gap-4'>
      <Image
        alt='product image'
        className='h-96 w-full max-w-sm object-cover'
        height={384}
        src={asset.image || 'https://picsum.photos/384'}
        width={384}
      />
      <div className='flex justify-between'>
        <div className='grid'>
          <span className='font-medium text-accents-3'>Product Name</span>
          <span>{asset.title}</span>
        </div>
        <div className='grid text-right'>
          <span className='font-medium text-accents-3'>Sale Price</span>
          <span>{`No price from notion`}</span>
        </div>
      </div>
      <p className='text-accents-1'>{asset.subtitle}</p>
    </div>
  );
}
