import type { Product } from '@/app/marketplace/test-product';

import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className='grid max-w-sm gap-4'>
      <Image
        alt='product image'
        className='h-96 w-full max-w-sm object-cover'
        height={384}
        src={product.images[0]}
        width={384}
      />
      <div className='flex justify-between'>
        <div className='grid'>
          <span className='font-medium text-accents-3'>Product Name</span>
          <span>{product.name}</span>
        </div>
        <div className='grid text-right'>
          <span className='font-medium text-accents-3'>Sale Price</span>
          <span>{product.price}</span>
        </div>
      </div>
      <p className='text-accents-1'>{product.tagline}</p>
    </div>
  );
}
