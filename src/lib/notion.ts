import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import {
  APIErrorCode,
  Client,
  ClientErrorCode,
  isNotionClientError,
  LogLevel,
  type NotionClientError,
} from '@notionhq/client';

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  logLevel: LogLevel.DEBUG,
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
      } else if (property.files[0].type === 'external') {
        return property.files[0].external.url;
      } else if (property.files[0].type === 'file') {
        return property.files[0].file.url;
      } else {
        return assertUnreachable();
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
    default:
      throw new NotionError('Something went wrong. Please try again.', 500);
  }
};

export async function getAssetsFullPageOrPartial(
  pageSize: number,
  cursor?: string,
) {
  try {
    return await notion.databases.query({
      database_id: databaseId,
      page_size: pageSize,
      start_cursor: cursor,
    });
  } catch (error) {
    if (isNotionClientError(error)) {
      return errorToUIError(error);
    }

    throw error;
  }
}
