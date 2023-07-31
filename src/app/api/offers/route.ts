import { getOffers, NotionError } from '@/lib/notion';
import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const pageSize = req.nextUrl.searchParams.get('pageSize') || 10;
  const cursor = req.nextUrl.searchParams.get('cursor') || undefined;

  try {
    const assets = await getOffers(Number(pageSize), cursor);

    if (!assets.offers.length) {
      return NextResponse.json('No offers found', {
        status: 404,
      });
    }

    return NextResponse.json(assets, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof NotionError) {
      return NextResponse.json(error.message, {
        status: error.status,
      });
    }

    return NextResponse.json(
      `Something went wrong. Please try again. ${error}`,
      {
        status: 500,
      },
    );
  }
}
