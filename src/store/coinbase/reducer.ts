import { createReducer, on } from '@ngrx/store';
import { ExchangeState } from '../state';
import {
  setAllAnalytics,
  setAllOpenOrders,
  setBalances,
  setCurrencyPairs,
  setPairs,
  setTickers,
} from './actions';

export const initialState: ExchangeState = {
  tickers: {},
  analytics: {},
  openOrders: {},
  balances: {},
  pairs: [],
  currencyPairs: [],
};

export const coinbaseReducer = createReducer(
  initialState,
  on(setTickers, (state, { tickers }) => {
    console.log('coinbase: set tickers', tickers);
    return { ...state, tickers };
  }),
  on(setAllAnalytics, (state, { analytics }) => {
    console.log('coinbase: set analytics', analytics);
    return { ...state, analytics };
  }),
  on(setAllOpenOrders, (state, { openOrders }) => {
    console.log('coinbase: set orders', openOrders);
    return { ...state, openOrders };
  }),
  on(setBalances, (state, { balances }) => {
    console.log('coinbase: set balances', balances);
    return { ...state, balances };
  }),
  on(setPairs, (state, { pairs }) => {
    console.log('coinbase: set pairs', pairs);
    return { ...state, pairs };
  }),
  on(setCurrencyPairs, (state, { currencyPairs }) => {
    console.log('coinbase: set currency pairs', currencyPairs);
    return { ...state, currencyPairs };
  })
);
