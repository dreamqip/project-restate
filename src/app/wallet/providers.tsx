'use client';

import { MnemonicsProvider } from '@/providers/mnemonics-provider';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mnenomics, setMnenomics] = useState<string[]>([]);

  return (
    <MnemonicsProvider mnemonics={mnenomics} setMnemonics={setMnenomics}>
      {children}
    </MnemonicsProvider>
  );
}
