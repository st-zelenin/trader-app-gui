import { environment } from './environments/environment';
import { Multiplicator } from './models/multiplicator';

export const API_URL = environment.API_URL;

export const BUY_MULTIPLICATORS: Multiplicator[] = [
  { text: '0.5 %', value: 0.005 },
  { text: '1 %', value: 0.01 },
  { text: '5 %', value: 0.05 },
  { text: '10 %', value: 0.1 },
];

export enum EXCHANGE {
  GATE_IO = 'GATE_IO',
  CRYPTO_COM = 'CRYPTO_COM',
  COINBASE = 'COINBASE',
}

export enum EXCHANGE_URL_PARAMS {
  GATE_IO = 'gate-io',
  CRYPTO_COM = 'crypto-com',
  COINBASE = 'coinbase',
}

// export const EXCHANGE_URL_PARAMS = {
//   GATE_IO: { param: 'gate-io', index: 0 },
//   CRYPTO_COM: { param: 'crypto-com', index: 1 },
// };
