import { createReducer, on } from '@ngrx/store';
import { EXCHANGE } from '../../constants';
import { ExchangeState } from '../models';
import { ExchangeActions } from './actions';

const log = (exchange: EXCHANGE, action: string, payload: unknown) => {
  // console.log(exchange, action, payload);
};

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
    products: undefined,
  };

  return createReducer(
    initialState,
    on(actions.setTickers, (state, { tickers }) => {
      log(exchange, 'set tickers', tickers);
      return { ...state, tickers };
    }),
    on(actions.getTickersError, (state) => {
      return { ...state, tickers: {} };
    }),
    on(actions.setAllAnalytics, (state, { analytics }) => {
      log(exchange, 'set analytics', analytics);
      return { ...state, analytics };
    }),
    on(actions.getAllAnalyticsError, (state) => {
      return { ...state, analytics: {} };
    }),
    on(actions.setAllOpenOrders, (state, { openOrders }) => {
      log(exchange, 'set orders', openOrders);
      return { ...state, openOrders };
    }),
    on(actions.getAllOpenOrdersError, (state) => {
      return { ...state, openOrders: {} };
    }),
    on(actions.setBalances, (state, { balances }) => {
      log(exchange, 'set balances', balances);
      return { ...state, balances };
    }),
    on(actions.getBalancesError, (state) => {
      return { ...state, balances: {} };
    }),
    on(actions.setPairs, (state, { pairs }) => {
      log(exchange, 'set pairs', pairs);
      return { ...state, pairs };
    }),
    on(actions.setCurrencyPairs, (state, { currencyPairs }) => {
      log(exchange, 'set currency pairs', currencyPairs);
      return { ...state, currencyPairs };
    }),
    on(actions.getCurrencyPairsError, (state) => {
      return { ...state, currencyPairs: [] };
    }),
    on(actions.setRecentBuyAverages, (state, { recentBuyAverages }) => {
      log(exchange, 'set recent BUY averages', recentBuyAverages);
      return { ...state, recentBuyAverages };
    }),
    on(actions.getRecentBuyAveragesError, (state) => {
      return { ...state, recentBuyAverages: {} };
    }),
    on(actions.setProducts, (state, { products }) => {
      log(exchange, 'set products', products);
      return { ...state, products };
    }),
    on(actions.getProductsError, (state) => {
      return { ...state, products: {} };
    })
  );
};
