import { getAssetById, NotionError, updateAssetByPageId } from '@/lib/notion';
import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const nftId = params.id;

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const pageId = params.id;
  const { price } = (await req.json()) as { price: number };

  try {
    await updateAssetByPageId(pageId, price);

    revalidateTag('offers');

    return NextResponse.json({ message: 'success' });
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
