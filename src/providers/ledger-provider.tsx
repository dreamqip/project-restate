'use client';

import type {
  AcceptNFTOfferRequest,
  AccountNFToken,
  AccountTransaction,
  BaseTransactionRequest,
  BurnNFTRequest,
  CancelNFTOfferRequest,
  CreateNFTOfferRequest,
  GetNFTRequest,
  GetTransactionsRequest,
  MintNFTRequest,
  SendPaymentRequest,
} from '@/types';
import type {
  BaseTransaction,
  NFTokenAcceptOffer,
  NFTokenBurn,
  NFTokenCancelOffer,
  NFTokenCreateOffer,
  NFTokenMint,
  Payment,
  TransactionMetadata,
  Wallet,
} from 'xrpl';

import { useWallet } from '@/hooks/use-wallet';
import { useXRPLClient } from '@/hooks/use-xrpl-client';
import { toXRPLMemos, toXRPLSigners } from '@/lib/transaction';
import { createContext, type PropsWithChildren, useCallback } from 'react';

interface GetNFTsResponse {
  account_nfts: AccountNFToken[];
  marker?: unknown;
}

interface MintNFTResponse {
  hash: string;
  NFTokenID: string;
}

interface FundWalletResponse {
  balance: number;
  wallet: Wallet;
}

interface CreateNFTOfferResponse {
  hash: string;
}

interface CancelNFTOfferResponse {
  hash: string;
}

interface AcceptNFTOfferResponse {
  hash: string;
}

interface BurnNFTResponse {
  hash: string;
}

interface SetAccountResponse {
  hash: string;
}

interface CreateOfferResponse {
  hash: string;
}

interface CancelOfferResponse {
  hash: string;
}

interface SubmitTransactionResponse {
  hash: string;
}

type LedgerContextType = {
  acceptNFTOffer: (
    payload: AcceptNFTOfferRequest,
  ) => Promise<AcceptNFTOfferResponse>;
  burnNFT: (payload: BurnNFTRequest) => Promise<BurnNFTResponse>;
  cancelNFTOffer: (
    payload: CancelNFTOfferRequest,
  ) => Promise<CancelNFTOfferResponse>;
  // cancelOffer: (payload: CancelOfferRequest) => Promise<CancelOfferResponse>;
  createNFTOffer: (
    payload: CreateNFTOfferRequest,
  ) => Promise<CreateNFTOfferResponse>;
  // createOffer: (payload: CreateOfferRequest) => Promise<CreateOfferResponse>;
  //   estimateNetworkFees: (payload: Transaction) => Promise<string>;
  fundWallet: () => Promise<FundWalletResponse>;
  //   getAccountInfo: () => Promise<AccountInfoResponse>;
  getNFTs: (payload?: GetNFTRequest) => Promise<GetNFTsResponse>;
  getTransactions: (
    payload?: GetTransactionsRequest,
  ) => Promise<AccountTransaction[]>;
  mintNFT: (payload: MintNFTRequest) => Promise<MintNFTResponse>;
  sendPayment: (payload: SendPaymentRequest) => Promise<string>;
  //   setAccount: (payload: SetAccountRequest) => Promise<SetAccountResponse>;
  //   setTrustline: (payload: SetTrustlineRequest) => Promise<string>;
  //   signMessage: (message: string) => string | undefined;
  //   submitTransaction: (
  //     payload: SubmitTransactionRequest,
  //   ) => Promise<SubmitTransactionResponse>;
};

export const LedgerContext = createContext<LedgerContextType | undefined>(
  undefined,
);

export function LedgerProvider({ children }: PropsWithChildren) {
  const { client } = useXRPLClient();
  const { wallet } = useWallet();

  const getTransactions = useCallback(
    async (payload?: GetTransactionsRequest) => {
      if (!client) {
        throw new Error(
          'You need to be connected to a ledger to make a transaction',
        );
      }

      if (!wallet) {
        throw new Error(
          'You need to have a wallet connected to make a transaction',
        );
      }

      try {
        // Prepare the transaction
        const prepared = await client.request({
          account: wallet.classicAddress,
          command: 'account_tx',
          limit: payload?.limit,
          marker: payload?.marker,
        });

        if (!prepared.result?.transactions) {
          throw new Error("Couldn't get the transaction history");
        } else {
          return prepared.result.transactions;
        }
      } catch (error) {
        throw error;
      }
    },
    [client, wallet],
  );

  const sendPayment = useCallback(
    async (payload: SendPaymentRequest) => {
      if (!client) {
        throw new Error(
          'You need to be connected to a ledger to make a transaction',
        );
      }

      if (!wallet) {
        throw new Error(
          'You need to have a wallet connected to make a transaction',
        );
      }

      try {
        // Prepare the transaction
        const prepared: Payment = await client.autofill({
          ...(buildBaseTransaction(payload, wallet, 'Payment') as Payment),
          Amount: payload.amount,
          Destination: payload.destination,
          ...(payload.destinationTag &&
            Number(payload.destinationTag) && {
              DestinationTag: Number(payload.destinationTag),
            }),
          ...(payload.flags && { Flags: payload.flags }),
        });

        // Sign the transaction
        const signed = wallet.sign(prepared);

        // Submit the signed blob
        const tx = await client.submitAndWait(signed.tx_blob);

        if (
          (tx.result.meta! as TransactionMetadata).TransactionResult ===
          'tesSUCCESS'
        ) {
          return tx.result.hash;
        }

        throw new Error(
          (tx.result.meta as TransactionMetadata)?.TransactionResult ||
            `Something went wrong, we couldn't submit properly the transaction`,
        );
      } catch (error) {
        throw error;
      }
    },
    [client, wallet],
  );

  const mintNFT = useCallback(
    async (payload: MintNFTRequest) => {
      if (!client) {
        throw new Error('You need to be connected to a ledger to mint an NFT');
      }

      if (!wallet) {
        throw new Error('You need to have a wallet connected to mint an NFT');
      }

      try {
        const tx = await client.submitAndWait(
          {
            ...(buildBaseTransaction(
              payload,
              wallet,
              'NFTokenMint',
            ) as NFTokenMint),
            NFTokenTaxon: payload.NFTokenTaxon,
            ...(payload.issuer && { Issuer: payload.issuer }),
            ...(payload.transferFee && { TransferFee: payload.transferFee }),
            ...(payload.URI && { URI: payload.URI }), // Must be hex encoded
            ...(payload.flags && { Flags: payload.flags }),
          },
          { wallet },
        );

        if (!tx.result.hash) {
          throw new Error("Couldn't mint the NFT");
        }

        const NFTokenID =
          tx.result.meta &&
          typeof tx.result.meta === 'object' &&
          'nftoken_id' in tx.result.meta
            ? ((tx.result.meta as any).nftoken_id as string)
            : undefined;

        if (NFTokenID) {
          return {
            hash: tx.result.hash,
            NFTokenID,
          };
        }

        if (
          (tx.result.meta! as TransactionMetadata).TransactionResult ===
          'tesSUCCESS'
        ) {
          throw new Error(
            "Couldn't fetch your NFT from the XRPL but the transaction was successful",
          );
        }

        throw new Error(
          (tx.result.meta as TransactionMetadata)?.TransactionResult ||
            "Something went wrong, we couldn't submit properly the transaction",
        );
      } catch (e) {
        // TODO: Do something with the error
        throw e;
      }
    },
    [client, wallet],
  );

  const burnNFT = useCallback(
    async (payload: BurnNFTRequest) => {
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      }

      if (!wallet) {
        throw new Error('You need to have a wallet connected');
      }

      try {
        const tx = await client.submitAndWait(
          {
            ...(buildBaseTransaction(
              payload,
              wallet,
              'NFTokenBurn',
            ) as NFTokenBurn),
            NFTokenID: payload.NFTokenID,
            ...(payload.owner && { Owner: payload.owner }),
          },
          { wallet },
        );

        if (!tx.result.hash) {
          throw new Error("Couldn't burn the NFT");
        }

        if (
          (tx.result.meta! as TransactionMetadata).TransactionResult !==
          'tesSUCCESS'
        ) {
          throw new Error(
            (tx.result.meta as TransactionMetadata)?.TransactionResult ||
              "Couldn't burn the NFT but the transaction was successful",
          );
        }

        return {
          hash: tx.result.hash,
        };
      } catch (e) {
        throw e;
      }
    },
    [client, wallet],
  );

  const getNFTs = useCallback(
    async (payload?: GetNFTRequest): Promise<GetNFTsResponse> => {
      // TODO: Extract validation to abstract function
      if (!client) {
        throw new Error('You need to be connected to a ledger to get the NFTs');
      }
      if (!wallet) {
        throw new Error('You need to have a wallet connected to get the NFTs');
      }

      // Prepare the transaction
      const prepared = await client.request({
        account: wallet.classicAddress,
        command: 'account_nfts',
        ledger_index: 'validated',
        limit: payload?.limit,
        marker: payload?.marker,
      });

      if (!prepared.result?.account_nfts) {
        throw new Error("Couldn't get the NFTs");
      } else {
        return {
          account_nfts: prepared.result.account_nfts,
          marker: prepared.result.marker,
        };
      }
    },
    [client, wallet],
  );

  const createNFTOffer = useCallback(
    async (payload: CreateNFTOfferRequest) => {
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      }

      if (!wallet) {
        throw new Error('You need to have a wallet connected');
      }

      try {
        const tx = await client.submitAndWait(
          {
            ...(buildBaseTransaction(
              payload,
              wallet,
              'NFTokenCreateOffer',
            ) as NFTokenCreateOffer),
            Amount: payload.amount,
            NFTokenID: payload.NFTokenID,
            ...(payload.owner && { Owner: payload.owner }),
            ...(payload.expiration && { Expiration: payload.expiration }),
            ...(payload.destination && { Destination: payload.destination }),
            ...(payload.flags && { Flags: payload.flags }),
          },
          { wallet },
        );

        if (!tx.result.hash) {
          throw new Error("Couldn't create the NFT offer");
        }

        if (
          (tx.result.meta! as TransactionMetadata).TransactionResult !==
          'tesSUCCESS'
        ) {
          throw new Error(
            (tx.result.meta as TransactionMetadata)?.TransactionResult ||
              "Couldn't create the NFT offer but the transaction was successful",
          );
        }

        return {
          hash: tx.result.hash,
        };
      } catch (e) {
        throw e;
      }
    },
    [client, wallet],
  );

  const cancelNFTOffer = useCallback(
    async (payload: CancelNFTOfferRequest) => {
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      }

      if (!wallet) {
        throw new Error('You need to have a wallet connected');
      }

      try {
        const tx = await client.submitAndWait(
          {
            ...(buildBaseTransaction(
              payload,
              wallet,
              'NFTokenCancelOffer',
            ) as NFTokenCancelOffer),
            NFTokenOffers: payload.NFTokenOffers,
          },
          { wallet },
        );

        if (!tx.result.hash) {
          throw new Error("Couldn't cancel the NFT offer");
        }

        if (
          (tx.result.meta! as TransactionMetadata).TransactionResult !==
          'tesSUCCESS'
        ) {
          throw new Error(
            (tx.result.meta as TransactionMetadata)?.TransactionResult ||
              "Couldn't cancel the NFT offer but the transaction was successful",
          );
        }

        return {
          hash: tx.result.hash,
        };
      } catch (e) {
        throw e;
      }
    },
    [client, wallet],
  );

  const acceptNFTOffer = useCallback(
    async (payload: AcceptNFTOfferRequest) => {
      if (!client) {
        throw new Error('You need to be connected to a ledger');
      }

      if (!wallet) {
        throw new Error('You need to have a wallet connected');
      }

      try {
        const tx = await client.submitAndWait(
          {
            ...(buildBaseTransaction(
              payload,
              wallet,
              'NFTokenAcceptOffer',
            ) as NFTokenAcceptOffer),
            ...(payload.NFTokenSellOffer && {
              NFTokenSellOffer: payload.NFTokenSellOffer,
            }),
            ...(payload.NFTokenBuyOffer && {
              NFTokenBuyOffer: payload.NFTokenBuyOffer,
            }),
            ...(payload.NFTokenBrokerFee && {
              NFTokenBrokerFee: payload.NFTokenBrokerFee,
            }),
          },
          { wallet },
        );

        if (!tx.result.hash) {
          throw new Error("Couldn't accept the NFT offer");
        }

        if (
          (tx.result.meta! as TransactionMetadata).TransactionResult !==
          'tesSUCCESS'
        ) {
          throw new Error(
            (tx.result.meta as TransactionMetadata)?.TransactionResult ||
              "Couldn't accept the NFT Offer but the transaction was successful",
          );
        }

        return {
          hash: tx.result.hash,
        };
      } catch (e) {
        throw e;
      }
    },
    [client, wallet],
  );

  const fundWallet = useCallback(async () => {
    if (!client)
      throw new Error(
        'You need to be connected to a ledger to fund the wallet',
      );
    if (!wallet)
      throw new Error('You need to have a wallet connected to fund the wallet');

    try {
      const walletWithAmount = await client.fundWallet(wallet);

      if (!walletWithAmount) throw new Error("Couldn't fund the wallet");

      return { ...walletWithAmount };
    } catch (e) {
      throw e;
    }
  }, [client, wallet]);

  const buildBaseTransaction = (
    payload: BaseTransactionRequest,
    wallet: Wallet,
    txType:
      | 'AccountSet'
      | 'NFTokenAcceptOffer'
      | 'NFTokenBurn'
      | 'NFTokenCancelOffer'
      | 'NFTokenCreateOffer'
      | 'NFTokenMint'
      | 'OfferCancel'
      | 'OfferCreate'
      | 'Payment'
      | 'TrustSet',
  ): BaseTransaction => ({
    Account: wallet.classicAddress,
    TransactionType: txType,
    ...(payload.fee && { Fee: payload.fee }),
    ...(payload.sequence && { Sequence: payload.sequence }),
    ...(payload.accountTxnID && { AccountTxnID: payload.accountTxnID }),
    ...(payload.lastLedgerSequence && {
      LastLedgerSequence: payload.lastLedgerSequence,
    }),
    ...(payload.memos && { Memos: toXRPLMemos(payload.memos) }), // Each field of each memo is hex encoded
    ...(payload.signers && { Signers: toXRPLSigners(payload.signers) }),
    ...(payload.sourceTag && { SourceTag: payload.sourceTag }),
    ...(payload.signingPubKey && { SigningPubKey: payload.signingPubKey }),
    ...(payload.ticketSequence && { TicketSequence: payload.ticketSequence }),
    ...(payload.txnSignature && { TxnSignature: payload.txnSignature }),
  });

  const values: LedgerContextType = {
    acceptNFTOffer,
    burnNFT,
    cancelNFTOffer,
    createNFTOffer,
    fundWallet,
    getNFTs,
    getTransactions,
    mintNFT,
    sendPayment,
  };

  return (
    <LedgerContext.Provider value={values}>{children}</LedgerContext.Provider>
  );
}
