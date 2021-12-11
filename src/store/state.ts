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
  shared: SharedState;
}

export const effects = [GateIoEffects, CryptoComEffects, SharedEffects];

export const reducers = {
  trading: gateIoReducer,
  crypto_com: cryptoComReducer,
  shared: sharedReducer,
};
