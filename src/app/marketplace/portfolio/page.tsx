import AssetCatalog from '@/components/asset-catalog';
import React from 'react';

import { MARKUP_PRODUCT } from '../test-product';
const assets = Array(12).fill(MARKUP_PRODUCT);

export default function Page() {
  // get here nfts for account (useAccountNfts)
  // parse them into Products and pass below
  return <AssetCatalog assets={assets} content='Portfolio' />;
}
