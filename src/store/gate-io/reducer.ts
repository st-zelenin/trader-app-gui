import { createReducer, on } from '@ngrx/store';
import { ExchangeState } from '../state';
import {
  setAllAnalytics,
  setAllOpenOrders,
  setAllTickers,
  setBalances,
} from './actions';

export const initialState: ExchangeState = {
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
