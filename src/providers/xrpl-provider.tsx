'use client';

import {
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import { Client as xrplClient } from 'xrpl';

export const XRPLClientContext = createContext<
  { client: xrplClient; network: string } | undefined
>(undefined);

type XRPLClientProviderProps = PropsWithChildren & {
  network: string;
};

export function XRPLClientProvider({
  children,
  network,
}: XRPLClientProviderProps) {
  const [client] = useState(() => {
    return new xrplClient(network);
  });

  useEffect(() => {
    client.connect();

    return () => {
      client.disconnect();
    };
  }, [client]);

  return (
    <XRPLClientContext.Provider value={{ client, network }}>
      {children}
    </XRPLClientContext.Provider>
  );
}
