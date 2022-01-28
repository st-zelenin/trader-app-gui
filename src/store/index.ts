import { Provider } from '@angular/core';
import { EXCHANGE } from '../constants';
import {
  BybitEffects,
  CoinbaseEffects,
  createExchangeReducer,
  CryptoComEffects,
  ExchangeActions,
  GateIoEffects,
} from './exchange';
import {
  BYBIT_ACTIONS,
  COINBASE_ACTIONS,
  CRYPTO_COM_ACTIONS,
  GATE_IO_ACTIONS,
} from './models';
import { SharedEffects, sharedReducer } from './shared';

const gateIoActions = new ExchangeActions(EXCHANGE.GATE_IO);
const coinbaseActions = new ExchangeActions(EXCHANGE.COINBASE);
const cryptoComActions = new ExchangeActions(EXCHANGE.CRYPTO_COM);
const bybitActions = new ExchangeActions(EXCHANGE.BYBIT);

export const reducers = {
  gate_io: createExchangeReducer(EXCHANGE.GATE_IO, gateIoActions),
  crypto_com: createExchangeReducer(EXCHANGE.CRYPTO_COM, cryptoComActions),
  coinbase: createExchangeReducer(EXCHANGE.COINBASE, coinbaseActions),
  bybit: createExchangeReducer(EXCHANGE.BYBIT, bybitActions),
  shared: sharedReducer,
};

export const effects = [
  GateIoEffects,
  CryptoComEffects,
  SharedEffects,
  CoinbaseEffects,
  BybitEffects,
];

export const exchangeActionsProviders: Provider[] = [
  { provide: GATE_IO_ACTIONS, useValue: gateIoActions },
  { provide: COINBASE_ACTIONS, useValue: coinbaseActions },
  { provide: CRYPTO_COM_ACTIONS, useValue: cryptoComActions },
  { provide: BYBIT_ACTIONS, useValue: bybitActions },
];
