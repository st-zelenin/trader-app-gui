import { environment } from './environments/environment';
import { Multiplicator } from './models/multiplicator';

export const API_URL = environment.API_URL;
export const API_URL_CRYPTO = environment.API_URL_CRYPTO;
export const API_URL_BYBIT = environment.API_URL_BYBIT;

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
}

export enum EXCHANGE_URL_PARAMS {
  GATE_IO = 'gate-io',
  CRYPTO_COM = 'crypto-com',
  COINBASE = 'coinbase',
  BYBIT = 'bybit',
}

export enum SORTING_TYPES {
  NONE = 'NONE',
  UPCOMING_SELL = 'UPCOMING_SELL',
  ESTIMATED_TOTAL = 'ESTIMATED_TOTAL',
}
