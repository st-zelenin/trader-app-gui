import { createReducer, on } from '@ngrx/store';
import { CryptoComState } from '.';
import { setBalances, setTickers } from './actions';

export const initialState: CryptoComState = {
  tickers: {},
  // analytics: {},
  // openOrders: {},
  balances: {},
};

export const cryptoComReducer = createReducer(
  initialState,
  on(setTickers, (state, { tickers }) => {
    console.log('set crypto.com tickers', tickers);
    return { ...state, tickers };
  }),
  // on(setAllAnalytics, (state, { analytics }) => {
  //   console.log('set analytics', analytics);
  //   return { ...state, analytics };
  // }),
  // on(setAllOpenOrders, (state, { openOrders }) => {
  //   console.log('set orders', openOrders);
  //   return { ...state, openOrders };
  // }),
  on(setBalances, (state, { balances }) => {
    console.log('set crypto.com balances', balances);
    return { ...state, balances };
  })
  // on(setBuyMultiplicator, (state, { buyMultiplicator }) => {
  //   console.log('set buy multiplicator', buyMultiplicator);
  //   return { ...state, buyMultiplicator };
  // })
);
