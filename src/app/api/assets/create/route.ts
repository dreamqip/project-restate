import type { CreateAssetPayload } from '@/types/notion';

import { createAsset, NotionError } from '@/lib/notion';
import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { assetId, ...rest }: { assetId: string } = await req.json();

  if (!assetId) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  try {
    const payload: CreateAssetPayload = {
      id: assetId,
      ...rest as Omit<CreateAssetPayload, 'id'>,
    };

    const response = await createAsset(payload);

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof NotionError) {
      return NextResponse.json(error.message, { status: error.status });
    }

    return NextResponse.json('Internal server error', { status: 500 });
  }
}
