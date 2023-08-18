import { LedgerContext } from '@/providers/ledger-provider';
import { useContext } from 'react';

export function useLedger() {
  const context = useContext(LedgerContext);

  if (context === undefined) {
    throw new Error('useLedger must be used within a LedgerProvider');
  }

  return context;
}
