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

export const cryptoComReducer = createReducer(
  initialState,
  on(setTickers, (state, { tickers }) => {
    console.log('crypto.com: set tickers', tickers);
    return { ...state, tickers };
  }),
  on(setAllAnalytics, (state, { analytics }) => {
    console.log('crypto.com: set analytics', analytics);
    return { ...state, analytics };
  }),
  on(setAllOpenOrders, (state, { openOrders }) => {
    console.log('crypto.com: set orders', openOrders);
    return { ...state, openOrders };
  }),
  on(setBalances, (state, { balances }) => {
    console.log('crypto.com: set balances', balances);
    return { ...state, balances };
  }),
  on(setPairs, (state, { pairs }) => {
    console.log('crypto.com: set pairs', pairs);
    return { ...state, pairs };
  }),
  on(setCurrencyPairs, (state, { currencyPairs }) => {
    console.log('crypto.com: set currency pairs', currencyPairs);
    return { ...state, currencyPairs };
  })
);
