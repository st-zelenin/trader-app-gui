import { createReducer, on } from '@ngrx/store';
import {
  setAllAnalytics,
  setAllOpenOrders,
  setBalances,
  setTickers,
} from './actions';
import { CoinbaseState } from './state';

export const initialState: CoinbaseState = {
  tickers: {},
  analytics: {},
  openOrders: {},
  balances: {},
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
  })
);
