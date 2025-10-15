import { environment } from './environments/environment';
import { Multiplicator } from './models/multiplicator';

export const API_URL = environment.API_URL;
export const API_URL_CRYPTO = environment.API_URL_CRYPTO;
export const API_URL_BYBIT = environment.API_URL_BYBIT;
export const API_URL_GATE = environment.API_URL_GATE;
export const API_URL_USER = environment.API_URL_USER;
export const API_URL_BINANCE = environment.API_URL_BINANCE;
export const API_HUB_URL = environment.API_HUB_URL;
export const WS_HUB_URL = environment.WS_HUB_URL;

export const BUY_MULTIPLICATORS: Multiplicator[] = [
  { text: '0.5 %', value: 0.005 },
  { text: '1 %', value: 0.01 },
  { text: '5 %', value: 0.05 },
  { text: '10 %', value: 0.1 },
  { text: '20 %', value: 0.2 },
  { text: '30 %', value: 0.3 },
  { text: '40 %', value: 0.4 },
  { text: '50 %', value: 0.5 },
];

export enum EXCHANGE {
  GATE_IO = 'GATE_IO',
  CRYPTO_COM = 'CRYPTO_COM',
  COINBASE = 'COINBASE',
  BYBIT = 'BYBIT',
  BINANCE = 'BINANCE',
}

export enum ExchangeUrlParams {
  GATE_IO = 'gate-io',
  CRYPTO_COM = 'crypto-com',
  COINBASE = 'coinbase',
  BYBIT = 'bybit',
  BINANCE = 'binance',
}

export enum SortingTypes {
  NONE = 'NONE',
  UPCOMING_SELL = 'UPCOMING_SELL',
  UPCOMING_BUY = 'UPCOMING_BUY',
  ESTIMATED_TOTAL = 'ESTIMATED_TOTAL',
  MOST_CHANGE = 'MOST_CHANGE',
}
