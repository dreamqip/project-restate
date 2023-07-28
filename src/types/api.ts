import type { Asset, Offer } from './notion';

type PaginationBase = {
  cursor?: string;
  pageSize?: number;
};

export type AssetsResponse = {
  assets: Asset[];
} & PaginationBase;

export type OfferResponse = {
  offers: Offer[];
} & PaginationBase;
