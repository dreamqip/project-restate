import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import { encodeSeed } from 'ripple-address-codec';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (unixTimestamp: number): string => {
  return dayjs.unix(946684800 + unixTimestamp).format('M/D/YYYY, h:mm:ss A');
};

export const getTimeZoneString = (unixTimestamp: number): string => {
  const date = dayjs.unix(unixTimestamp);
  const timeZoneOffset = date.utcOffset() / 60;
  const timeZoneString =
    timeZoneOffset >= 0 ? `+${timeZoneOffset}` : timeZoneOffset.toString();
  return `UTC ${timeZoneString}`;
};

// Move to crypto?
export function mnemonicsToSeed(
  mnemonics: string,
  type: 'ed25519' | 'secp256k1' = 'secp256k1',
) {
  const encoder = new TextEncoder();
  const entropy = encoder.encode(mnemonics).slice(0, 16);

  return encodeSeed(Buffer.from(entropy), type);
}

export function padWithLeadingZeros(num: number, totalLength: number) {
  return String(num).padStart(totalLength, '0');
}
