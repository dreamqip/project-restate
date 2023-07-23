import type { Memo, Signer } from '@/types';
import type {
  Memo as XRPLMemo,
  Signer as XRPLSigner,
} from 'xrpl/dist/npm/models/common';

export const toXRPLMemos = (
  memos: Memo[] | undefined,
): undefined | XRPLMemo[] => {
  if (memos === undefined) return undefined;
  return memos.map(({ memo }) => {
    return {
      Memo: {
        ...(memo.memoType ? { MemoType: memo.memoType } : {}),
        ...(memo.memoData ? { MemoData: memo.memoData } : {}),
        ...(memo.memoFormat ? { MemoFormat: memo.memoFormat } : {}),
      },
    };
  });
};

export const toXRPLSigners = (
  signers: Signer[] | undefined,
): undefined | XRPLSigner[] => {
  if (signers === undefined) return undefined;
  return signers.map(({ signer }) => {
    return {
      Signer: {
        Account: signer.account,
        SigningPubKey: signer.signingPubKey,
        TxnSignature: signer.txnSignature,
      },
    };
  });
};
