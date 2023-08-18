export const convertHexCurrencyToString = (hexCurrency: string): string => {
  if (hexCurrency.length !== 40) {
    return hexCurrency;
  }
  // Trim trailing zeros in the hex string
  hexCurrency = hexCurrency.toLowerCase().replace(/0+$/, '');

  // Convert hex to Buffer and then to ASCII
  return Buffer.from(hexCurrency, 'hex').toString('ascii');
};
