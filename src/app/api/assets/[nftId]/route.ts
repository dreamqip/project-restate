import { getAssetById, NotionError } from '@/lib/notion';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { nftId: string } },
) {
  const nftId = params.nftId;

  try {
    const fullAsset = await getAssetById(nftId);

    return NextResponse.json(fullAsset);
  } catch (error) {
    if (error instanceof NotionError) {
      return NextResponse.json(error.message, {
        status: error.status,
      });
    }

    return NextResponse.json(`Something went wrong. ${error}`, {
      status: 500,
    });
  }
}
