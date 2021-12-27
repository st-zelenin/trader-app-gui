import { createAction, props } from '@ngrx/store';
import {
  AllAverages,
  Balances,
  OpenOrdersByPairs,
  Tickers,
} from '../../models';

export enum ACTIONS {
  GET_ALL_TICKERS = '[crypto.com][Tickers] get all tickers',
  GET_ALL_TICKERS_ERROR = '[crypto.com][Tickers] get all tickers error',
  SET_ALL_TICKERS = '[crypto.com][Tickers] set all tickers',

  GET_ALL_ANALYTICS = '[crypto.com][Analytics] get all analytics',
  GET_ALL_ANALYTICS_ERROR = '[crypto.com][Analytics] get all analytics error',
  SET_ALL_ANALYTICS = '[crypto.com][Analytics] set all analytics',

  GET_ALL_OPEN_ORDERS = '[crypto.com][Orders] get all open orders',
  GET_ALL_OPEN_ORDERS_ERROR = '[crypto.com][Orders] get all open orders error',
  SET_ALL_OPEN_ORDERS = '[crypto.com][Orders] set all open orders',

  GET_BALANCES = '[crypto.com][Balances] get balances',
  GET_BALANCES_ERROR = '[crypto.com][Balances] get balances error',
  SET_BALANCES = '[crypto.com][Balances] set balances',

  GET_CURRENCY_PAIRS = '[crypto.com][Currency Pairs] get currency pairs',
  GET_CURRENCY_PAIRS_ERROR = '[crypto.com][Currency Pairs] get currency pairs error',
  SET_CURRENCY_PAIRS = '[crypto.com][Currency Pairs] set currency pairs',

  SET_PAIRS = '[crypto.com][Pairs] set pairs',
}

export const getTickers = createAction(ACTIONS.GET_ALL_TICKERS);

export const getTickersError = createAction(ACTIONS.GET_ALL_TICKERS_ERROR);

export const setTickers = createAction(
  ACTIONS.SET_ALL_TICKERS,
  props<{ tickers: Tickers }>()
);

export const getAllAnalytics = createAction(ACTIONS.GET_ALL_ANALYTICS);

export const getAllAnalyticsError = createAction(
  ACTIONS.GET_ALL_ANALYTICS_ERROR
);

export const setAllAnalytics = createAction(
  ACTIONS.SET_ALL_ANALYTICS,
  props<{ analytics: AllAverages }>()
);

export const getAllOpenOrders = createAction(ACTIONS.GET_ALL_OPEN_ORDERS);

export const getAllOpenOrdersError = createAction(
  ACTIONS.GET_ALL_OPEN_ORDERS_ERROR
);

export const setAllOpenOrders = createAction(
  ACTIONS.SET_ALL_OPEN_ORDERS,
  props<{ openOrders: OpenOrdersByPairs }>()
);

export const getBalances = createAction(ACTIONS.GET_BALANCES);

export const getBalancesError = createAction(ACTIONS.GET_BALANCES_ERROR);

export const setBalances = createAction(
  ACTIONS.SET_BALANCES,
  props<{ balances: Balances }>()
);

export const getCurrencyPairs = createAction(ACTIONS.GET_CURRENCY_PAIRS);

export const getCurrencyPairsError = createAction(
  ACTIONS.GET_CURRENCY_PAIRS_ERROR
);

export const setCurrencyPairs = createAction(
  ACTIONS.SET_CURRENCY_PAIRS,
  props<{ currencyPairs: string[] }>()
);

export const setPairs = createAction(
  ACTIONS.SET_PAIRS,
  props<{ pairs: string[] }>()
);
