'use client';

import AssetCatalog from '@/components/asset-catalog';
import { useAccountNfts } from '@/hooks/use-account-nfts';
import React from 'react';

import { MARKUP_PRODUCT } from '../test-product';
const assets = Array(12).fill(MARKUP_PRODUCT);

export default function Page() {
  const { nfts } = useAccountNfts();
  // get nft ids from nfts
  // filter by them to get all assets from notion
  // add them to assets and pass below
  return nfts.length ? (
    <AssetCatalog assets={assets} content='Portfolio' />
  ) : (
    <div>Connect Wallet</div>
  );
}
