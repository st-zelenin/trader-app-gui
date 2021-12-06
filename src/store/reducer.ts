import { createReducer, on } from '@ngrx/store';
import { BUY_MULTIPLICATORS } from '../models/constants';
import {
  setAllAnalytics,
  setAllOpenOrders,
  setAllTickers,
  setBalances,
  setBuyMultiplicator,
} from './actions';
import { State } from './state';

export const initialState: State = {
  buyMultiplicator: BUY_MULTIPLICATORS[0],
  tickers: {},
  analytics: {},
  openOrders: {},
  balances: {},
};

export const reducer = createReducer(
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
  }),
  on(setBuyMultiplicator, (state, { buyMultiplicator }) => {
    console.log('set buy multiplicator', buyMultiplicator);
    return { ...state, buyMultiplicator };
  })
);
