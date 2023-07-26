'use client';

import { createContext, type PropsWithChildren, useState } from 'react';

type MnenomicsContextType = {
  mnemonics: string[];
  setMnemonics: (mnemonics: string[]) => void;
};

export const MnemonicsContext = createContext<MnenomicsContextType | undefined>(
  undefined,
);

export function MnemonicsProvider({ children }: PropsWithChildren) {
  const [mnemonics, setMnemonics] = useState<string[]>([]);

  return (
    <MnemonicsContext.Provider
      value={{ mnemonics: mnemonics, setMnemonics: setMnemonics }}
    >
      {children}
    </MnemonicsContext.Provider>
  );
}
