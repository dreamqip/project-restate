import type { Asset } from "./notion";

export type AssetsResponse = {
  assets: Asset[];
  hasMore: boolean;
  nextCursor: null | string;
};
