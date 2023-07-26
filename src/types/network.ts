export enum Network {
  AMM_DEVNET = 'AMM-Devnet',
  CUSTOM = 'Custom',
  DEVNET = 'Devnet',
  MAINNET = 'Mainnet',
  TESTNET = 'Testnet',
}

export interface NetworkData {
  description?: string;
  name: string;
  server: string;
}
