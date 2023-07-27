import type { AssetsResponse } from '@/types/api';

export async function getAssets() {
  // We cannot use relative paths here because this code will be executed on the server side
  const response = await fetch(`${process.env.HOST}/api/assets`);

  // Do something more useful with the response
  if (!response.ok) {
    return;
  }

  return (await response.json()) as AssetsResponse;
}
