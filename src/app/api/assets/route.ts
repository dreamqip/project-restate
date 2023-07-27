import type { Asset } from '@/types/notion';

import {
  extractPropertyItemValueToString,
  getAssetsFullPageOrPartial,
  NotionError,
} from '@/lib/notion';
import { isFullPage } from '@notionhq/client';
import { NextResponse } from 'next/server';

// Because we have custom webpack config, environment variables are not available for some reason or they've been cleared
// And with runtime: 'edge' we can use process.env as usual
export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const cursor = searchParams.get('cursor') || undefined;

  try {
    const assets: Asset[] = [];

    const rawData = await getAssetsFullPageOrPartial(pageSize, cursor);

    for (const page of rawData.results) {
      // @ts-expect-error
      if (!isFullPage(page)) {
        continue;
      }

      const { properties } = page;

      const asset: Asset = {
        image: extractPropertyItemValueToString(properties.Images),
        subtitle: extractPropertyItemValueToString(properties.Subtitle),
        title: extractPropertyItemValueToString(properties.Title),
      };

      assets.push(asset);
    }

    const response = {
      assets,
      hasMore: rawData.has_more,
      nextCursor: rawData.next_cursor,
    };

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof NotionError) {
      return NextResponse.json(error.message, {
        status: error.status,
      });
    }

    return NextResponse.json(
      'Something went wrong. Please try again.' + error,
      {
        status: 500,
      },
    );
  }
}
