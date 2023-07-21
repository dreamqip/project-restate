import { XRPLClientContext } from '@/providers/xrpl-provider';
import { useContext } from 'react';

export function useXRPLClient() {
  const client = useContext(XRPLClientContext);

  if (!client) {
    throw new Error(
      'useXRPLClient must be used within a XRPLClientProvider',
    );
  }

  return client;
}
