import { getAssetsByIds, NotionError } from '@/lib/notion';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { nftIds } = (await req.json()) as { nftIds: string[] };

  if (!nftIds || !Array.isArray(nftIds)) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  try {
    const response = await getAssetsByIds(nftIds);

    if (!response.length) {
      return NextResponse.json({ error: 'No assets found' }, { status: 404 });
    }

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof NotionError) {
      return NextResponse.json(error.message, { status: error.status });
    }

    return NextResponse.json('Internal server error', { status: 500 });
  }
}
