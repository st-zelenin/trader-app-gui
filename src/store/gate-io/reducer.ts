import { createReducer, on } from '@ngrx/store';
import { ExchangeState } from '../state';
import {
  setAllAnalytics,
  setAllOpenOrders,
  setAllTickers,
  setBalances,
  setCurrencyPairs,
  setPairs,
} from './actions';

export const initialState: ExchangeState = {
  tickers: {},
  analytics: {},
  openOrders: {},
  balances: {},
  pairs: [],
  currencyPairs: [],
};

export const gateIoReducer = createReducer(
  initialState,
  on(setAllTickers, (state, { tickers }) => {
    console.log('gate.io: set tickers', tickers);
    return { ...state, tickers };
  }),
  on(setAllAnalytics, (state, { analytics }) => {
    console.log('gate.io: set analytics', analytics);
    return { ...state, analytics };
  }),
  on(setAllOpenOrders, (state, { openOrders }) => {
    console.log('gate.io: set orders', openOrders);
    return { ...state, openOrders };
  }),
  on(setBalances, (state, { balances }) => {
    console.log('gate.io: set balances', balances);
    return { ...state, balances };
  }),
  on(setPairs, (state, { pairs }) => {
    console.log('gate.io: set pairs', pairs);
    return { ...state, pairs };
  }),
  on(setCurrencyPairs, (state, { currencyPairs }) => {
    console.log('gate.io: set currency pairs', currencyPairs);
    return { ...state, currencyPairs };
  })
);
