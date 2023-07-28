import AssetCatalog from '@/components/asset-catalog';
import { getAssets } from '@/lib/api';
import React from 'react';

export const runtime = 'edge';

export default async function Page() {
  const res = await getAssets();

  // Temporary
  if (!res) {
    return null;
  }

  // get here nfts from notion
  // parse them into Products and pass below
  return <AssetCatalog assets={res.assets} content='Offers' />;
}
