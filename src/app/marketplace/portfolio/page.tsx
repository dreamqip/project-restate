import ProductCatalog from '@/components/product-catalog';
import React from 'react';

import { MARKUP_PRODUCT } from '../test-product';

const products = Array(12).fill(MARKUP_PRODUCT);

export default function Page() {
  // get here nfts for account (useAccountNfts)
  // parse them into Products and pass below
  return <ProductCatalog content='Portfolio' products={products} />;
}
