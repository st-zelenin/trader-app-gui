import { createReducer, on } from '@ngrx/store';
import { EXCHANGE } from '../../constants';
import { ExchangeState } from '../models';
import { ExchangeActions } from './actions';

export const createExchangeReducer = (
  exchange: EXCHANGE,
  actions: ExchangeActions
) => {
  const initialState: ExchangeState = {
    tickers: {},
    analytics: {},
    openOrders: {},
    balances: {},
    recentBuyAverages: {},
    pairs: [],
    currencyPairs: [],
  };

  return createReducer(
    initialState,
    on(actions.setTickers, (state, { tickers }) => {
      console.log(exchange, 'set tickers', tickers);
      return { ...state, tickers };
    }),
    on(actions.setAllAnalytics, (state, { analytics }) => {
      console.log(exchange, 'set analytics', analytics);
      return { ...state, analytics };
    }),
    on(actions.setAllOpenOrders, (state, { openOrders }) => {
      console.log(exchange, 'set orders', openOrders);
      return { ...state, openOrders };
    }),
    on(actions.setBalances, (state, { balances }) => {
      console.log(exchange, 'set balances', balances);
      return { ...state, balances };
    }),
    on(actions.setPairs, (state, { pairs }) => {
      console.log(exchange, 'set pairs', pairs);
      return { ...state, pairs };
    }),
    on(actions.setCurrencyPairs, (state, { currencyPairs }) => {
      console.log(exchange, 'set currency pairs', currencyPairs);
      return { ...state, currencyPairs };
    }),
    on(actions.setRecentBuyAverages, (state, { recentBuyAverages }) => {
      console.log(exchange, 'set recent BUY averages', recentBuyAverages);
      return { ...state, recentBuyAverages };
    })
  );
};
