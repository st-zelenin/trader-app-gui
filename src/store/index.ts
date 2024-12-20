import { Provider } from '@angular/core';

import {
  BinanceEffects,
  BybitEffects,
  CoinbaseEffects,
  CryptoComEffects,
  ExchangeActions,
  GateIoEffects,
  createExchangeReducer,
} from './exchange';
import { BINANCE_ACTIONS, BYBIT_ACTIONS, COINBASE_ACTIONS, CRYPTO_COM_ACTIONS, GATE_IO_ACTIONS } from './models';
import { SharedEffects, sharedReducer } from './shared';
import { EXCHANGE } from '../constants';

const gateIoActions = new ExchangeActions(EXCHANGE.GATE_IO);
const coinbaseActions = new ExchangeActions(EXCHANGE.COINBASE);
const cryptoComActions = new ExchangeActions(EXCHANGE.CRYPTO_COM);
const bybitActions = new ExchangeActions(EXCHANGE.BYBIT);
const binanceActions = new ExchangeActions(EXCHANGE.BINANCE);

export const reducers = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  gate_io: createExchangeReducer(EXCHANGE.GATE_IO, gateIoActions),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  crypto_com: createExchangeReducer(EXCHANGE.CRYPTO_COM, cryptoComActions),
  coinbase: createExchangeReducer(EXCHANGE.COINBASE, coinbaseActions),
  bybit: createExchangeReducer(EXCHANGE.BYBIT, bybitActions),
  binance: createExchangeReducer(EXCHANGE.BINANCE, binanceActions),
  shared: sharedReducer,
};

export const effects = [GateIoEffects, CryptoComEffects, SharedEffects, CoinbaseEffects, BybitEffects, BinanceEffects];

export const exchangeActionsProviders: Provider[] = [
  { provide: GATE_IO_ACTIONS, useValue: gateIoActions },
  { provide: COINBASE_ACTIONS, useValue: coinbaseActions },
  { provide: CRYPTO_COM_ACTIONS, useValue: cryptoComActions },
  { provide: BYBIT_ACTIONS, useValue: bybitActions },
  { provide: BINANCE_ACTIONS, useValue: binanceActions },
];
