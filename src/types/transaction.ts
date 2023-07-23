import type { Transaction, TransactionMetadata } from 'xrpl';
import type { ResponseOnlyTxInfo } from 'xrpl/dist/npm/models/common';

export enum TransactionStatus {
  // pending: transaction is pending to be a success or rejected (in progress)
  Pending = 'PENDING',
  // rejected: transaction has been rejected
  Rejected = 'REJECTED',
  // success: transaction has been successful
  Success = 'SUCCESS',
  // waiting: waiting for a user interaction
  Waiting = 'WAITING',
}

export enum TransactionTypes {
  AccountDelete = 'AccountDelete',
  AccountSet = 'AccountSet',
  CheckCancel = 'CheckCancel',
  CheckCash = 'CheckCash',
  CheckCreate = 'CheckCreate',
  DepositPreauth = 'DepositPreauth',
  EscrowCancel = 'EscrowCancel',
  EscrowCreate = 'EscrowCreate',
  EscrowFinish = 'EscrowFinish',
  NFTokenAcceptOffer = 'NFTokenAcceptOffer',
  NFTokenBurn = 'NFTokenBurn',
  NFTokenCancelOffer = 'NFTokenCancelOffer',
  NFTokenCreateOffer = 'NFTokenCreateOffer',
  NFTokenMint = 'NFTokenMint',
  OfferCancel = 'OfferCancel',
  OfferCreate = 'OfferCreate',
  Payment = 'Payment',
  PaymentChannelClaim = 'PaymentChannelClaim',
  PaymentChannelCreate = 'PaymentChannelCreate',
  PaymentChannelFund = 'PaymentChannelFund',
  SetRegularKey = 'SetRegularKey',
  SignerListSet = 'SignerListSet',
  TicketCreate = 'TicketCreate',
  TrustSet = 'TrustSet',
}

export interface AccountTransaction {
  ledger_index: number;
  meta: string | TransactionMetadata;
  tx?: Transaction & ResponseOnlyTxInfo;
  tx_blob?: string;
  validated: boolean;
}
