import AssetCatalog from '@/components/asset-catalog';
import { getOffers } from '@/lib/api';

export const runtime = 'edge';

export default async function Page() {
  const res = await getOffers();

  // Temporary, until we have a proper error page
  if (typeof res === 'string') {
    return <div>Something went wrong - {res}</div>;
  }

  return <AssetCatalog assets={res.offers} content='Offers' />;
}
