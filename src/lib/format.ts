import { type Amount, dropsToXrp, type IssuedCurrencyAmount } from 'xrpl';

import { convertHexCurrencyToString } from './convert';

const formatValue = (value: number) => {
  return new Intl.NumberFormat(navigator.language, {
    currency: 'XRP',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: value.toString().split('.')[1]?.length || 0,
    style: 'currency',
  })
    .format(value)
    .replace(/\s?XRP\s?/, '');
};

export const formatAmount = (amount: Amount | IssuedCurrencyAmount) => {
  let value: number;
  let currency: string;

  if (typeof amount === 'string') {
    value = Number(dropsToXrp(amount));
    currency = 'XRP';
  } else {
    if (amount.currency.length === 40) {
      // Hex representation of currency
      currency = convertHexCurrencyToString(amount.currency);
    } else {
      currency = amount.currency;
    }
    value = Number(amount.value);
  }

  return `${formatValue(value)} ${currency.toUpperCase()}`;
};
