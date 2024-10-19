import { InjectionToken } from '@angular/core';

import { ExchangeActions } from './exchange';
import { SharedState } from './shared';
import { EXCHANGE } from '../constants';
import { AllAverages, Averages, Balances, CryptoPair, OpenOrdersByPairs, Products, Tickers } from '../models';

export const GATE_IO_ACTIONS = new InjectionToken<ExchangeActions>(EXCHANGE.GATE_IO);
export const COINBASE_ACTIONS = new InjectionToken<ExchangeActions>(EXCHANGE.COINBASE);
export const CRYPTO_COM_ACTIONS = new InjectionToken<ExchangeActions>(EXCHANGE.CRYPTO_COM);
export const BYBIT_ACTIONS = new InjectionToken<ExchangeActions>(EXCHANGE.BYBIT);
export const BINANCE_ACTIONS = new InjectionToken<ExchangeActions>(EXCHANGE.BINANCE);

export interface ExchangeState {
  tickers: Tickers;
  analytics: AllAverages;
  openOrders: OpenOrdersByPairs;
  balances: Balances;
  recentBuyAverages: Averages;
  pairs: CryptoPair[];
  currencyPairs: string[];
  products?: Products;
}

export interface AppState {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  gate_io: ExchangeState;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  crypto_com: ExchangeState;
  coinbase: ExchangeState;
  bybit: ExchangeState;
  binance: ExchangeState;
  shared: SharedState;
}
