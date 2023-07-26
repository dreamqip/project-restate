import type {
  AccountSetFlagsInterface,
  NFTokenCreateOfferFlagsInterface,
  NFTokenMintFlagsInterface,
  OfferCreateFlagsInterface,
  PaymentFlagsInterface,
  TrustSetFlagsInterface,
} from 'xrpl';

export interface Memo {
  memo: {
    memoData?: string;
    memoFormat?: string;
    memoType?: string;
  };
}

export interface Signer {
  signer: {
    account: string;
    signingPubKey: string;
    txnSignature: string;
  };
}

export type TrustSetFlags = number | TrustSetFlagsInterface;

export type PaymentFlags = number | PaymentFlagsInterface;

export type MintNFTFlags = NFTokenMintFlagsInterface | number;

export type CreateNFTOfferFlags = NFTokenCreateOfferFlagsInterface | number;

export type SetAccountFlags = AccountSetFlagsInterface | number;

export type CreateOfferFlags = number | OfferCreateFlagsInterface;
