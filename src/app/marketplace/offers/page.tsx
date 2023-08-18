import AssetCatalog from '@/components/asset-catalog';
import { getOffers } from '@/lib/api';

export const revalidate = 1800; // 30 minutes or revalidateTag
export const runtime = 'edge';

export default async function Page() {
  const res = await getOffers();

  return <AssetCatalog assets={res.offers} content='Offers' />;
}
