import { ActionCreator, Creator, TypedAction } from '@ngrx/store/src/models';
import { EXCHANGE } from 'src/constants';
import { AllAverages, Balances, OpenOrdersByPairs, Tickers } from '../models';
import { actions as bybitActions, BybitEffects } from './bybit';
import { actions as coinbaseActions, CoinbaseEffects } from './coinbase';
import { actions as cryptoComActions, CryptoComEffects } from './crypto-com';
import { createExchangeReducer } from './exchange-reducer';
import { actions as gateIoActions, GateIoEffects } from './gate-io';
import { SharedEffects, sharedReducer, SharedState } from './shared';

type NoPropsAction = ActionCreator<string, Creator<any[], TypedAction<string>>>;
type ActionWithProps<T> = ActionCreator<
  string,
  Creator<T[], T & TypedAction<string>>
>;

export interface ExchangeActions {
  getTickers: NoPropsAction;
  getTickersError: NoPropsAction;
  setTickers: ActionWithProps<{ tickers: Tickers }>;
  getAllAnalytics: NoPropsAction;
  getAllAnalyticsError: NoPropsAction;
  setAllAnalytics: ActionWithProps<{ analytics: AllAverages }>;
  getAllOpenOrders: NoPropsAction;
  getAllOpenOrdersError: NoPropsAction;
  setAllOpenOrders: ActionWithProps<{ openOrders: OpenOrdersByPairs }>;
  getBalances: NoPropsAction;
  getBalancesError: NoPropsAction;
  setBalances: ActionWithProps<{ balances: Balances }>;
  getCurrencyPairs: NoPropsAction;
  getCurrencyPairsError: NoPropsAction;
  setCurrencyPairs: ActionWithProps<{ currencyPairs: string[] }>;
  setPairs: ActionWithProps<{ pairs: string[] }>;
}

export interface ExchangeState {
  tickers: Tickers;
  analytics: AllAverages;
  openOrders: OpenOrdersByPairs;
  balances: Balances;
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

export const effects = [
  GateIoEffects,
  CryptoComEffects,
  SharedEffects,
  CoinbaseEffects,
  BybitEffects,
];

export const reducers = {
  gate_io: createExchangeReducer(EXCHANGE.GATE_IO, gateIoActions),
  crypto_com: createExchangeReducer(EXCHANGE.CRYPTO_COM, cryptoComActions),
  coinbase: createExchangeReducer(EXCHANGE.COINBASE, coinbaseActions),
  bybit: createExchangeReducer(EXCHANGE.BYBIT, bybitActions),
  shared: sharedReducer,
};
