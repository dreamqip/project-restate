import { type ClassValue, clsx } from 'clsx';
import { encodeSeed } from 'ripple-address-codec';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Move to crypto?
export function mnemonicsToSeed(
  mnemonics: string,
  type: 'ed25519' | 'secp256k1' = 'secp256k1',
) {
  const encoder = new TextEncoder();
  const entropy = encoder.encode(mnemonics).slice(0, 16);

  return encodeSeed(Buffer.from(entropy), type);
}
