import { CryptoPair } from './crypto-pair';

export interface User {
  id: string;
  name: string;
  gate: CryptoPair[];
  crypto: CryptoPair[];
  coinbase: CryptoPair[];
  bybit: CryptoPair[];
  binance: CryptoPair[];
}
