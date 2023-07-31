'use client';

import Image, { type ImageProps } from 'next/legacy/image';
import { type SyntheticEvent, useEffect, useState } from 'react';

type Props = ImageProps & {
  fallback?: ImageProps['src'];
};

// Note: This is a legacy version of the Image component.
// It is recommended to use the new Image component instead.
// But for proper blur shimmers animation, we need to use the legacy version.

export default function ImageLegacyWithFallback({
  alt,
  fallback = '/fallback.svg',
  src,
  ...props
}: Props) {
  const [error, setError] = useState<null | SyntheticEvent<
    HTMLImageElement,
    Event
  >>(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <Image
      alt={alt}
      onError={setError}
      src={error ? fallback : src}
      {...props}
    />
  );
}
