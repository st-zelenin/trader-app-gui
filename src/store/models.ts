import { InjectionToken } from '@angular/core';
import { EXCHANGE } from '../constants';
import {
  AllAverages,
  Averages,
  Balances,
  OpenOrdersByPairs,
  Tickers,
} from '../models';
import { ExchangeActions } from './exchange';
import { SharedState } from './shared';

export const GATE_IO_ACTIONS = new InjectionToken<ExchangeActions>(
  EXCHANGE.GATE_IO
);
export const COINBASE_ACTIONS = new InjectionToken<ExchangeActions>(
  EXCHANGE.COINBASE
);
export const CRYPTO_COM_ACTIONS = new InjectionToken<ExchangeActions>(
  EXCHANGE.CRYPTO_COM
);
export const BYBIT_ACTIONS = new InjectionToken<ExchangeActions>(
  EXCHANGE.BYBIT
);

export interface ExchangeState {
  tickers: Tickers;
  analytics: AllAverages;
  openOrders: OpenOrdersByPairs;
  balances: Balances;
  recentBuyAverages: Averages;
  pairs: string[];
  currencyPairs: string[];
}

export interface AppState {
  gate_io: ExchangeState;
  crypto_com: ExchangeState;
  coinbase: ExchangeState;
  bybit: ExchangeState;
  shared: SharedState;
}
