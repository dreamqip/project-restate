'use client';

import { Networks } from '@/lib/networks';
import { LedgerProvider } from '@/providers/ledger-provider';
import { MnemonicsProvider } from '@/providers/mnemonics-provider';
import { WalletProvider } from '@/providers/wallet-provider';
import { XRPLClientProvider } from '@/providers/xrpl-provider';
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <XRPLClientProvider network={Networks.Testnet}>
        <MnemonicsProvider>
          <WalletProvider>
            <LedgerProvider>{children}</LedgerProvider>
          </WalletProvider>
        </MnemonicsProvider>
      </XRPLClientProvider>
      <Toaster closeButton position='bottom-right' theme='dark' />
    </>
  );
}
