import type { AccountRoot, SignerList } from 'xrpl/dist/npm/models/ledger';

import Big from 'big.js';
import {
  classicAddressToXAddress,
  type Client,
  type Node,
  type TransactionStream,
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

export const countXRPDifference = (affected_nodes: Node[], address: string) => {
  // Helper to find an account in an AffectedNodes array and see how much
  // its balance changed, if at all. Fortunately, each account appears at most
  // once in the AffectedNodes array, so we can return as soon as we find it.

  // Note: this reports the net balance change. If the address is the sender,
  // the transaction cost is deducted and combined with XRP sent/received

  for (let i = 0; i < affected_nodes.length; i++) {
    const node = affected_nodes[i];

    if ('ModifiedNode' in node) {
      // modifies an existing ledger entry
      const ledger_entry = node.ModifiedNode;
      if (
        ledger_entry.LedgerEntryType === 'AccountRoot' &&
        ledger_entry.FinalFields?.Account === address
      ) {
        if (!ledger_entry.PreviousFields?.hasOwnProperty('Balance')) {
          console.log('XRP balance did not change.');
        } else {
          // Balance is in PreviousFields, so it changed. Time for
          // high-precision math!
          const old_balance = new Big(
            ledger_entry.PreviousFields.Balance as string,
          );
          const new_balance = new Big(
            ledger_entry.FinalFields.Balance as string,
          );
          const diff_in_drops = new_balance.minus(old_balance);
          const xrp_amount = diff_in_drops.div(1e6);
          if (xrp_amount.gte(0)) {
            console.log('Received ' + xrp_amount.toString() + ' XRP.');
            return {
              received: true,
              xrp_amount: xrp_amount.toString(),
            };
          } else {
            console.log('Spent ' + xrp_amount.abs().toString() + ' XRP.');
            return {
              spent: true,
              xrp_amount: xrp_amount.abs().toString(),
            };
          }
        }
      }
    } else if ('CreatedNode' in node) {
      const ledger_entry = node.CreatedNode;
      if (
        ledger_entry.LedgerEntryType === 'AccountRoot' &&
        ledger_entry.NewFields.Account === address
      ) {
        const balance_drops = new Big(ledger_entry.NewFields.Balance as string);
        const xrp_amount = balance_drops.div(1e6);
        console.log(
          'Received ' + xrp_amount.toString() + ' XRP (account funded).',
        );
        return {
          funded: true,
          xrp_amount: xrp_amount.toString(),
        };
      }
    } // accounts cannot be deleted at this time, so we ignore DeletedNode
  }

  console.log('Did not find address in affected nodes.');
  return;
};

export const countXRPReceived = (tx: TransactionStream, address: string) => {
  if (tx?.meta?.TransactionResult !== 'tesSUCCESS') {
    console.log('Transaction failed.');
    return;
  }
  if (tx.transaction.TransactionType === 'Payment') {
    if (tx.transaction.Destination !== address) {
      console.log('Not the destination of this payment.');
      return;
    }
    if (typeof tx.meta.delivered_amount === 'string') {
      const amount_in_drops = new Big(tx.meta.delivered_amount);
      const xrp_amount = amount_in_drops.div(1e6);
      console.log('Received ' + xrp_amount.toString() + ' XRP.');
      return {
        received: true,
        xrp_amount: xrp_amount.toString(),
      };
    } else {
      console.log('Received non-XRP currency.');
      return;
    }
  } else if (
    [
      'CheckCash',
      'EscrowFinish',
      'OfferCreate',
      'PaymentChannelClaim',
      'PaymentChannelFund',
    ].includes(tx.transaction.TransactionType)
  ) {
    countXRPDifference(tx.meta.AffectedNodes, address);
  } else {
    console.log(
      'Not a currency-delivering transaction type (' +
        tx.transaction.TransactionType +
        ').',
    );
  }
};
