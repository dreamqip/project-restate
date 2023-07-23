import type { AccountRoot, SignerList } from 'xrpl/dist/npm/models/ledger';

import {
  classicAddressToXAddress,
  type Client,
  type Wallet,
  XrplError,
} from 'xrpl';

type WalletDetailsResponse = {
  accountData: AccountRoot & { signer_lists?: SignerList[] | undefined };
  accountReserves: number;
  address: string;
  xAddress: string;
};

export const getWalletDetails = async (
  client: Client,
  wallet: Wallet,
): Promise<undefined | WalletDetailsResponse> => {
  try {
    // Get the wallet details: https://xrpl.org/account_info.html
    const {
      result: { account_data },
    } = await client.request({
      account: wallet.classicAddress,
      command: 'account_info',
      ledger_index: 'validated',
    });

    const ownerCount = account_data.OwnerCount || 0;

    // Get the reserve base and increment
    const {
      result: {
        info: { validated_ledger },
      },
    } = await client.request({
      command: 'server_info',
    });

    if (!validated_ledger) {
      throw new Error('No validated ledger found!');
    }

    // Calculate the reserves by multiplying the owner count by the increment and adding the base reserve to it.
    const accountReserves =
      ownerCount * validated_ledger.reserve_inc_xrp +
      validated_ledger.reserve_base_xrp;

    return {
      accountData: account_data,
      accountReserves,
      address: wallet.classicAddress,
      xAddress: classicAddressToXAddress(wallet.classicAddress, false, false), // Learn more: https://xrpaddress.info/
    };
  } catch (error) {
    if (error instanceof XrplError) {
      console.log('Wallet not found!');
      return;
    }

    console.error('Error getting wallet details', error);
    return;
  }
};

type TransactionHistoryResponse = {
  asd: any;
};

type TransactionHistoryPayload = {
  account: string;
  command: string;
  limit: number;
  marker?: string;
};

// export const getTransactionHistory = async (
//   client: Client,
//   wallet: Wallet,
//   limit: number = 10,
// ): Promise<null | TransactionHistoryResponse> => {
//   let marker;

//   try {
//     const payload: TransactionHistoryPayload = {
//       account: wallet.address,
//       command: 'account_tx',
//       limit,
//     };

//     if (marker) {
//       payload.marker = marker;
//     }

//     const { result } = await client.request(payload);
//     const { marker: nextMarker, transactions } = result;

//     const values = transactions.map((transaction) => {
//       const { meta, tx } = transaction;
//       return {
//         Account: tx.Account,
//         Amount: tx.Amount,
//         Destination: tx.Destination,
//         Fee: tx.Fee,
//         Hash: tx.hash,
//         result: meta?.TransactionResult,
//         TransactionType: tx.TransactionType,
//       };
//     });

//     const loadMore = !!nextMarker;

//     return {
//       loadMore: !!nextMarker,
      
//     }
//   } catch (error) {
//     console.error('Error getting transaction history', error);
//     return null;
//   }
// };
