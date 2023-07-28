import { getOfferById, NotionError } from '@/lib/notion';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { nftId: string } },
) {
  const nftId = params.nftId;

  try {
    const fullOffer = await getOfferById(nftId);

    return NextResponse.json(fullOffer);
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
