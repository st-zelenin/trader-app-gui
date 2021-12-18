import { CoinbaseEffects, coinbaseReducer, CoinbaseState } from './coinbase';
import {
  CryptoComEffects,
  cryptoComReducer,
  CryptoComState,
} from './crypto-com';
import { GateIoEffects, gateIoReducer, State } from './gate-io';
import { SharedEffects, sharedReducer, SharedState } from './shared';
export interface AppState {
  trading: State;
  crypto_com: CryptoComState;
  coinbase: CoinbaseState;
  shared: SharedState;
}

export const effects = [
  GateIoEffects,
  CryptoComEffects,
  SharedEffects,
  CoinbaseEffects,
];

export const reducers = {
  trading: gateIoReducer,
  crypto_com: cryptoComReducer,
  coinbase: coinbaseReducer,
  shared: sharedReducer,
};
