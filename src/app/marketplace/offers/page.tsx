import ProductCatalog from '@/components/product-catalog';
import { getAssets } from '@/lib/api';
import React from 'react';

import { MARKUP_PRODUCT } from '../test-product';

const products = Array(12).fill(MARKUP_PRODUCT);

export const runtime = 'edge';

export default async function Page() {
  const res = await getAssets();

  // Temporary
  if (!res) {
    return null;
  }

  // get here nfts from notion
  // parse them into Products and pass below
  return <ProductCatalog assets={res.assets} content='Offers' />;
}
