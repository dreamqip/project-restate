'use client';

import { createContext, type PropsWithChildren } from 'react';

type MnenomicsContextType = {
  mnemonics: string[];
  setMnemonics: (mnemonics: string[]) => void;
};

export const MnemonicsContext = createContext<MnenomicsContextType | undefined>(
  undefined,
);

type MnemonicsProviderProps = PropsWithChildren & {
  mnemonics: string[];
  setMnemonics: (mnemonics: string[]) => void;
};

export function MnemonicsProvider({
  children,
  mnemonics: mnemonics,
  setMnemonics: setMnemonics,
}: MnemonicsProviderProps) {
  return (
    <MnemonicsContext.Provider
      value={{ mnemonics: mnemonics, setMnemonics: setMnemonics }}
    >
      {children}
    </MnemonicsContext.Provider>
  );
}
