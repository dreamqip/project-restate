import { decrypt, encrypt } from './crypto';

export const saveMnemonics = (mnemonic: string, password: string) => {
  try {
    localStorage.setItem('mnemonic', encrypt(mnemonic, password));
  } catch (error) {
    throw error;
  }
};

export const getMnemonics = (password: string): string => {
  try {
    const mnemonic = localStorage.getItem('mnemonic');
    if (!mnemonic) throw new Error('No mnemonic found');
    return decrypt(mnemonic, password);
  } catch (error) {
    throw error;
  }
};

export const removeMnemonics = () => {
  localStorage.removeItem('mnemonic');
};
