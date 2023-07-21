import { MnemonicsContext } from '@/providers/mnemonics-provider';
import { useContext } from 'react';

export function useMnemonics() {
  const context = useContext(MnemonicsContext);

  if (!context) {
    throw new Error('useMnemonics must be used within a MnemonicsProvider');
  }

  return context;
}
