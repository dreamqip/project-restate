'use client';

import { Button } from '@/components/ui';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

interface AssetGalleryProps {
  images: string[];
}

export default function AssetGallery({ images }: AssetGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? prevIndex : prevIndex - 1,
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? prevIndex : prevIndex + 1,
    );
  };

  return (
    <div>
      <div className='relative flex gap-4 overflow-hidden sm:-mx-32'>
        <div
          style={{
            transform: `translateX(-${currentIndex * (384 + 16)}px)`,
          }}
          className='flex transition-transform duration-300 ease-in-out sm:ml-32'
        >
          {images.map((image, index) => (
            <div className='mr-4 flex-none' key={index}>
              <Image
                alt='asset image'
                className='h-96 w-96 object-cover'
                height={384}
                src={image}
                width={384}
              />
            </div>
          ))}
        </div>
      </div>

      <div className='mt-4 flex max-w-sm justify-between'>
        <Button
          className='p-0 text-lg font-medium text-accents-3 hover:text-accents-1'
          onClick={prevSlide}
          variant='ghost'
        >
          <ChevronLeftIcon className='mr-1 inline-block h-6 w-6' /> Previous
        </Button>
        <Button
          className='p-0 text-lg font-medium text-accents-3 hover:text-accents-1'
          onClick={nextSlide}
          variant='ghost'
        >
          Next <ChevronRightIcon className='ml-1 inline-block h-6 w-6' />
        </Button>
      </div>
    </div>
  );
}
