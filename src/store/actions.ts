import { createAction, props } from '@ngrx/store';
import {
  AllAverages,
  Balances,
  Multiplicator,
  PairOpenOrders,
  Tickers,
} from '../models';

export enum ACTIONS {
  GET_ALL_TICKERS = '[Tickers] get all tickers',
  GET_ALL_TICKERS_ERROR = '[Tickers] get all tickers error',
  SET_ALL_TICKERS = '[Tickers] set all tickers',

  GET_ALL_ANALYTICS = '[Analytics] get all analytics',
  GET_ALL_ANALYTICS_ERROR = '[Analytics] get all analytics error',
  SET_ALL_ANALYTICS = '[Analytics] set all analytics',

  GET_ALL_OPEN_ORDERS = '[Orders] get all open orders',
  GET_ALL_OPEN_ORDERS_ERROR = '[Orders] get all open orders error',
  SET_ALL_OPEN_ORDERS = '[Orders] set all open orders',

  GET_BALANCES = '[Balances] get balances',
  GET_BALANCES_ERROR = '[Balances] get balances error',
  SET_BALANCES = '[Balances] set balances',

  SET_BUY_MULTIPLICATOR = '[Multiplicators] set buy multiplicator',
}

export const getAllTickers = createAction(ACTIONS.GET_ALL_TICKERS);

export const getAllTickersError = createAction(ACTIONS.GET_ALL_TICKERS_ERROR);

export const setAllTickers = createAction(
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
  props<{ openOrders: PairOpenOrders }>()
);

export const getBalances = createAction(ACTIONS.GET_BALANCES);

export const getBalancesError = createAction(ACTIONS.GET_BALANCES_ERROR);

export const setBalances = createAction(
  ACTIONS.SET_BALANCES,
  props<{ balances: Balances }>()
);

export const setBuyMultiplicator = createAction(
  ACTIONS.SET_BUY_MULTIPLICATOR,
  props<{ buyMultiplicator: Multiplicator }>()
);
