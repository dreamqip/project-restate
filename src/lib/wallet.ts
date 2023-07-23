import type { Wallet } from 'xrpl';

import { decrypt, encrypt } from './crypto';

export const saveWallet = (wallet: Wallet, password: string) => {
  try {
    localStorage.setItem('wallet', encrypt(JSON.stringify(wallet), password));
  } catch (error) {
    throw error;
  }
};

export const getWallet = (password: string): Wallet => {
  try {
    const wallet = localStorage.getItem('wallet');
    if (!wallet) throw new Error('No wallet found');
    return JSON.parse(decrypt(wallet, password));
  } catch (error) {
    throw error;
  }
};

export const removeWallet = () => {
  localStorage.removeItem('wallet');
};
