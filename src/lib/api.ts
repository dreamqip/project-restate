import type { FullAssetResponse, OfferResponse } from '@/types/api';

export async function getOffers(
  pageSize?: number,
  cursor?: string,
): Promise<OfferResponse> {
  // We cannot use relative paths here because this code will be executed on the server side
  const url = new URL('/api/offers', process.env.NEXT_PUBLIC_HOST);

  if (pageSize) {
    url.searchParams.append('pageSize', pageSize.toString());
  }

  if (cursor) {
    url.searchParams.append('cursor', cursor);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    next: { tags: ['offers'] },
  });

  if (!response.ok) {
    throw new Error((await response.json()) as string);
  }

  return (await response.json()) as OfferResponse;
}

export async function getAssetById(
  nftId: string,
): Promise<FullAssetResponse> {
  const url = new URL(`/api/assets/${nftId}`, process.env.NEXT_PUBLIC_HOST);

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });

  // Do something more useful with the response
  if (!response.ok) {
    throw new Error((await response.json()) as string);
  }

  return (await response.json()) as FullAssetResponse;
}

export async function updateAssetByPageId(
  pageId: string,
  price: number,
): Promise<{ message: string }> {
  const url = new URL(`/api/assets/${pageId}`, process.env.NEXT_PUBLIC_HOST);

  const response = await fetch(url.toString(), {
    body: JSON.stringify({ price }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error((await response.json()) as string);
  }

  return (await response.json()) as { message: string };
}
