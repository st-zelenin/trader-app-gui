import { AllAverages, Balances, PairOpenOrders, Tickers } from '../models';
import { CoinbaseEffects, coinbaseReducer } from './coinbase';
import { CryptoComEffects, cryptoComReducer } from './crypto-com';
import { GateIoEffects, gateIoReducer } from './gate-io';
import { SharedEffects, sharedReducer, SharedState } from './shared';

export interface ExchangeState {
  tickers: Tickers;
  analytics: AllAverages;
  openOrders: PairOpenOrders;
  balances: Balances;
}

export interface AppState {
  gate_io: ExchangeState;
  crypto_com: ExchangeState;
  coinbase: ExchangeState;
  shared: SharedState;
}

export const effects = [
  GateIoEffects,
  CryptoComEffects,
  SharedEffects,
  CoinbaseEffects,
];

export const reducers = {
  gate_io: gateIoReducer,
  crypto_com: cryptoComReducer,
  coinbase: coinbaseReducer,
  shared: sharedReducer,
};
