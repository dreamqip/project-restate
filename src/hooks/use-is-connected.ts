import { useEffect, useState } from 'react';

import { useXRPLClient } from './use-xrpl-client';

export function useIsConnected() {
  const { client } = useXRPLClient();
  const [connected, setConnected] = useState(client.isConnected());

  useEffect(() => {
    const onConnected = () => {
      console.log('connected');
      setConnected(true);
    };

    const onDisconnected = () => {
      console.log('disconnected');
      setConnected(false);
    };

    client.on('connected', onConnected);
    client.on('disconnected', onDisconnected);

    return () => {
      client.off('connected', onConnected);
      client.off('disconnected', onDisconnected);
    };
  });

  return connected;
}
