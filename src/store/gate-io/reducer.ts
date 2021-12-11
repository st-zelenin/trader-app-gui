import { createReducer, on } from '@ngrx/store';
import {
  setAllAnalytics,
  setAllOpenOrders,
  setAllTickers,
  setBalances,
} from './actions';
import { State } from './state';

export const initialState: State = {
  tickers: {},
  analytics: {},
  openOrders: {},
  balances: {},
};

export const gateIoReducer = createReducer(
  initialState,
  on(setAllTickers, (state, { tickers }) => {
    console.log('set tickers', tickers);
    return { ...state, tickers };
  }),
  on(setAllAnalytics, (state, { analytics }) => {
    console.log('set analytics', analytics);
    return { ...state, analytics };
  }),
  on(setAllOpenOrders, (state, { openOrders }) => {
    console.log('set orders', openOrders);
    return { ...state, openOrders };
  }),
  on(setBalances, (state, { balances }) => {
    console.log('set balances', balances);
    return { ...state, balances };
  })
);
