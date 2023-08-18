import AssetWrapper from '@/components/asset-wrapper';
import { getAssetById } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function Page({ params }: { params: { nftId: string } }) {
  const response = await getAssetById(params.nftId);

  return <AssetWrapper asset={response} nftId={params.nftId} />;
}
