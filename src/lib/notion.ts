import type { CreateAssetPayload, FullAsset, Offer } from '@/types/notion';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import {
  APIErrorCode,
  Client,
  ClientErrorCode,
  isFullPage,
  isNotionClientError,
  LogLevel,
  type NotionClientError,
} from '@notionhq/client';

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  logLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : undefined,
});

const databaseId = `${process.env.NOTION_DATABASE_ID}`;

function assertUnreachable(): never {
  throw new Error("Didn't expect to get here");
}

function userToString(userBase: { id: string; name?: null | string }) {
  return `${userBase.id}: ${userBase.name || 'Unknown Name'}`;
}

export function extractPropertyItemValueToString(
  property: PageObjectResponse['properties'][string],
): string {
  switch (property.type) {
    case 'checkbox':
      return property.checkbox.toString();
    case 'created_by':
      return userToString(property.created_by);
    case 'created_time':
      return new Date(property.created_time).toISOString();
    case 'date':
      return property.date ? new Date(property.date.start).toISOString() : '';
    case 'email':
      return property.email ?? '';
    case 'url':
      return property.url ?? '';
    case 'number':
      return typeof property.number === 'number'
        ? property.number.toString()
        : '';
    case 'phone_number':
      return property.phone_number ?? '';
    case 'select':
      if (!property.select) {
        return '';
      }
      return `${property.select.id} ${property.select.name}`;
    case 'multi_select':
      if (!property.multi_select) {
        return '';
      }
      return property.multi_select
        .map((select) => `${select.id} ${select.name}`)
        .join(', ');
    case 'last_edited_by':
      return userToString(property.last_edited_by);
    case 'last_edited_time':
      return new Date(property.last_edited_time).toISOString();
    case 'title':
      return property.title.map((text) => text.plain_text).join('');
    case 'rich_text':
      return property.rich_text.map((text) => text.plain_text).join('');
    case 'files':
      if (!property.files.length) {
        return '';
      } else {
        return property.files
          .map((file) => {
            if (file.type === 'external') {
              return file.external.url;
            }

            return file.type === 'file' ? file.file.url : '';
          })
          .join(', ');
      }

    case 'status':
      return property.status?.name ?? '';
  }

  return assertUnreachable();
}

export class NotionError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    // Ensure the correct prototype chain is maintained
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const errorToUIError = (error: NotionClientError) => {
  switch (error.code) {
    case ClientErrorCode.RequestTimeout:
      throw new NotionError('Request timed out. Please try again.', 408);
    case ClientErrorCode.ResponseError:
      throw new NotionError('Something went wrong. Please try again.', 500);
    case APIErrorCode.ObjectNotFound:
      throw new NotionError(
        'We couldn`t find the object you were looking for. Please try another database.',
        404,
      );
    case APIErrorCode.Unauthorized:
      throw new NotionError(
        'API key is missing or invalid. Please check your API key.',
        401,
      );
    case APIErrorCode.RestrictedResource:
      throw new NotionError(
        'This resource has been restricted. Please check your permissions.',
        403,
      );
    case APIErrorCode.InvalidJSON:
      throw new NotionError('The JSON you provided is invalid.', 400);
    case APIErrorCode.InvalidRequestURL:
      throw new NotionError('The URL you provided is invalid.', 400);
    case APIErrorCode.InvalidRequest:
      throw new NotionError('The request you provided is invalid.', 400);
    case APIErrorCode.ValidationError:
      throw new NotionError('The request you provided is invalid.', 400);
    default:
      throw new NotionError('Something went wrong. Please try again.', 500);
  }
};

export async function getOffers(pageSize: number, cursor?: string) {
  try {
    const rawData = await notion.databases.query({
      database_id: databaseId,
      // Filter out pages that are not have price and nfId
      filter: {
        and: [
          {
            number: {
              greater_than: 0,
            },
            property: 'Price',
          },
          {
            property: 'ID',
            title: {
              is_not_empty: true,
            },
          },
        ],
      },
      page_size: pageSize,
      start_cursor: cursor,
    });

    const offers: Offer[] = [];

    for (const page of rawData.results) {
      // @ts-expect-error
      if (!isFullPage(page)) {
        continue;
      }

      const { properties } = page;

      const offer: Offer = {
        // Images would be as string separated by comma, so we need to split it and take the first one
        image: extractPropertyItemValueToString(properties.Images).split(
          ',',
        )[0],
        nftId: extractPropertyItemValueToString(properties.ID),
        price: extractPropertyItemValueToString(properties.Price),
        subtitle: extractPropertyItemValueToString(properties.Subtitle),
        title: extractPropertyItemValueToString(properties.Title),
      };

      offers.push(offer);
    }

    return {
      hasMore: rawData.has_more,
      nextCursor: rawData.next_cursor,
      offers,
    };
  } catch (error) {
    if (isNotionClientError(error)) {
      return errorToUIError(error);
    }

    throw error;
  }
}

export async function getAssetsByIds(nftIds: string[]) {
  try {
    const rawData = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'ID',
            title: {
              is_not_empty: true,
            },
          },
        ],
      },
    });

    const assets: Offer[] = [];

    for (const page of rawData.results) {
      // @ts-expect-error
      if (!isFullPage(page)) {
        continue;
      }

      if (
        !nftIds.includes(extractPropertyItemValueToString(page.properties.ID))
      ) {
        continue;
      }

      const { properties } = page;

      const asset: Offer = {
        // Images would be as string separated by comma, so we need to split it and take the first one
        image: extractPropertyItemValueToString(properties.Images).split(
          ',',
        )[0],
        nftId: extractPropertyItemValueToString(properties.ID),
        price:
          extractPropertyItemValueToString(properties.Price) === '0'
            ? ''
            : extractPropertyItemValueToString(properties.Price),
        subtitle: extractPropertyItemValueToString(properties.Subtitle),
        title: extractPropertyItemValueToString(properties.Title),
      };

      assets.push(asset);
    }

    return assets;
  } catch (error) {
    if (isNotionClientError(error)) {
      return errorToUIError(error);
    }

    throw error;
  }
}

export async function getAssetById(nftId: string) {
  try {
    const rawData = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'ID',
        title: {
          equals: nftId,
        },
      },
    });

    const page = rawData.results[0];

    if (!page) {
      throw new NotionError('Asset not found.', 404);
    }

    // @ts-expect-error
    if (!isFullPage(page)) {
      throw new NotionError('Asset not found.', 404);
    }

    const { properties } = page;

    const fullAsset: FullAsset = {
      images: extractPropertyItemValueToString(properties.Images)
        .split(',')
        .map((image) => image.trim()),
      subtitle: extractPropertyItemValueToString(properties.Subtitle),
      title: extractPropertyItemValueToString(properties.Title),
      warranties: [
        {
          certifier: extractPropertyItemValueToString(
            properties['Asset Identity Certifier'],
          ),
          date: extractPropertyItemValueToString(
            properties['Asset Identity Date'],
          ),
          description: extractPropertyItemValueToString(
            properties['Asset Identity'],
          ),
          type: 'Asset Identity',
        },
        {
          certifier: extractPropertyItemValueToString(
            properties['NFT Pairing Certifier'],
          ),
          date: extractPropertyItemValueToString(
            properties['NFT Pairing Date'],
          ),
          description: extractPropertyItemValueToString(
            properties['NFT Pairing'],
          ),
          type: 'NFT Pairing',
        },
        {
          certifier: extractPropertyItemValueToString(
            properties['Carbon Offset Certifier'],
          ),
          date: extractPropertyItemValueToString(
            properties['Carbon Offset Date'],
          ),
          description: extractPropertyItemValueToString(
            properties['Carbon Offset'],
          ),
          type: 'Carbon Offset',
        },
        {
          certifier: extractPropertyItemValueToString(
            properties['Artwork License Certifier'],
          ),
          date: extractPropertyItemValueToString(
            properties['Artwork License Date'],
          ),
          description: extractPropertyItemValueToString(
            properties['Artwork License'],
          ),
          type: 'Artwork License',
        },
        {
          certifier: extractPropertyItemValueToString(
            properties['Vault Report Certifier'],
          ),
          date: extractPropertyItemValueToString(
            properties['Vault Report Date'],
          ),
          description: extractPropertyItemValueToString(
            properties['Vault Report'],
          ),
          type: 'Vault Report',
        },
      ],
    };

    return {
      asset: fullAsset,
      pageId: page.id,
    };
  } catch (error) {
    if (isNotionClientError(error)) {
      return errorToUIError(error);
    }

    throw error;
  }
}

export async function updateAssetByPageId(pageId: string, payload: number) {
  try {
    // Update price of the asset
    const rawData = await notion.pages.update({
      page_id: pageId,
      properties: {
        Price: {
          number: payload,
        },
      },
    });

    return rawData;
  } catch (error) {
    if (isNotionClientError(error)) {
      return errorToUIError(error);
    }

    throw error;
  }
}

export async function createAsset(payload: CreateAssetPayload) {
  try {
    const rawData = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        'Artwork License': {
          rich_text: [
            {
              text: {
                content: payload.artworkLicense,
              },
            },
          ],
        },
        'Artwork License Certifier': {
          rich_text: [
            {
              text: {
                content: payload.artworkLicenseCertifier,
              },
            },
          ],
        },
        'Artwork License Date': {
          date: {
            start: payload.artworkLicenseDate,
          },
        },
        'Asset Identity': {
          rich_text: [
            {
              text: {
                content: payload.assetIdentity,
              },
            },
          ],
        },
        'Asset Identity Certifier': {
          rich_text: [
            {
              text: {
                content: payload.assetIdentityCertifier,
              },
            },
          ],
        },
        'Asset Identity Date': {
          date: {
            start: payload.assetIdentityDate,
          },
        },
        'Carbon Offset': {
          rich_text: [
            {
              text: {
                content: payload.carbonOffset,
              },
            },
          ],
        },
        'Carbon Offset Certifier': {
          rich_text: [
            {
              text: {
                content: payload.carbonOffsetCertifier,
              },
            },
          ],
        },
        'Carbon Offset Date': {
          date: {
            start: payload.carbonOffsetDate,
          },
        },
        Category: {
          select: {
            name: payload.category,
          },
        },
        ID: {
          title: [
            {
              text: {
                content: payload.id,
              },
            },
          ],
        },
        Images: {
          files: [
            ...payload.images.split(',').map((image) => ({
              external: {
                url: image.trim(),
              },
              name: 'image',
            })),
          ],
        },
        'NFT Pairing': {
          rich_text: [
            {
              text: {
                content: payload.nftPairing,
              },
            },
          ],
        },
        'NFT Pairing Certifier': {
          rich_text: [
            {
              text: {
                content: payload.nftPairingCertifier,
              },
            },
          ],
        },
        'NFT Pairing Date': {
          date: {
            start: payload.nftPairingDate,
          },
        },
        Subtitle: {
          rich_text: [
            {
              text: {
                content: payload.subtitle,
              },
            },
          ],
        },
        Title: {
          rich_text: [
            {
              text: {
                content: payload.title,
              },
            },
          ],
        },
        'Vault Report': {
          rich_text: [
            {
              text: {
                content: payload.vaultReport,
              },
            },
          ],
        },
        'Vault Report Certifier': {
          rich_text: [
            {
              text: {
                content: payload.vaultReportCertifier,
              },
            },
          ],
        },
        'Vault Report Date': {
          date: {
            start: payload.vaultReportDate,
          },
        },
      },
    });

    return rawData;
  } catch (error) {
    if (isNotionClientError(error)) {
      return errorToUIError(error);
    }

    throw error;
  }
}
