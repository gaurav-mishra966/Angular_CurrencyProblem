import { Injectable, computed, signal } from '@angular/core';

type Currency = 'USD' | 'EUR' | 'CAD' | 'GBP' | 'INR';
type ExchangeRates = Record<Currency, number>;

interface CurrencySymbol {
  code: Currency;
  symbol: string;
}

const DEFAULT_CURRENCIES: CurrencySymbol[] = [
  { code: 'USD', symbol: '$' },
  { code: 'GBP', symbol: '£' },
  { code: 'CAD', symbol: 'C$' },
  { code: 'EUR', symbol: '€' },
  { code: 'INR', symbol: '₹' },
];

@Injectable({
  providedIn: 'root',
})
export class CurrencyServiceService {
  readonly currencies = signal(DEFAULT_CURRENCIES);
  readonly currentCurrency = signal(DEFAULT_CURRENCIES[0]);

  readonly exchangeRates = signal<ExchangeRates>({
    EUR: 1.14,
    GBP: 1.31,
    USD: 1,
    INR: 85.3,
    CAD: 1.39,
  });

  readonly currentExchangeRate = computed(
    () => this.exchangeRates()[this.currentCurrency().code]
  );

  setCurrency(currencyCode: string): Currency {
    const newCurrency = this.currencies().find((c) => c.code === currencyCode);
    if (newCurrency) {
      this.currentCurrency.set(newCurrency);
    }
    return newCurrency ? newCurrency.code : this.currentCurrency().code;
  }

  convertAmount(amount: number, from: Currency, to: Currency): number {
    const rates = this.exchangeRates();

    if (!rates[from] || !rates[to]) {
      console.warn(`Invalid currency code: from=${from}, to=${to}`);
      return 0;
    }

    const usdAmount = amount / rates[from]; // Convert from source to USD
    const convertedAmount = usdAmount * rates[to]; // Convert from USD to target

    return parseFloat(convertedAmount.toFixed(2));
  }

  getSymbolFor(code: Currency): string {
    return this.currencies().find((c) => c.code === code)?.symbol ?? '';
  }
}
