import AssetWrapper from '@/components/asset-wrapper';
import { getAssetById } from '@/lib/api';

export default async function Page({ params }: { params: { nftId: string } }) {
  const response = await getAssetById(params.nftId);

  if (typeof response === 'string') {
    return <div>{response}</div>;
  }

  return <AssetWrapper asset={response} nftId={params.nftId} />;
}
