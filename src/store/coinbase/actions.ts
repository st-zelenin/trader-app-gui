import { createAction, props } from '@ngrx/store';
import { AllAverages, Balances, PairOpenOrders, Tickers } from '../../models';

export enum ACTIONS {
  GET_ALL_TICKERS = '[coinbase][Tickers] get all tickers',
  GET_ALL_TICKERS_ERROR = '[coinbase][Tickers] get all tickers error',
  SET_ALL_TICKERS = '[coinbase][Tickers] set all tickers',

  GET_ALL_ANALYTICS = '[coinbase][Analytics] get all analytics',
  GET_ALL_ANALYTICS_ERROR = '[coinbase][Analytics] get all analytics error',
  SET_ALL_ANALYTICS = '[coinbase][Analytics] set all analytics',

  GET_ALL_OPEN_ORDERS = '[coinbase][Orders] get all open orders',
  GET_ALL_OPEN_ORDERS_ERROR = '[coinbase][Orders] get all open orders error',
  SET_ALL_OPEN_ORDERS = '[coinbase][Orders] set all open orders',

  GET_BALANCES = '[coinbase][Balances] get balances',
  GET_BALANCES_ERROR = '[coinbase][Balances] get balances error',
  SET_BALANCES = '[coinbase][Balances] set balances',
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
  props<{ openOrders: PairOpenOrders }>()
);

export const getBalances = createAction(ACTIONS.GET_BALANCES);

export const getBalancesError = createAction(ACTIONS.GET_BALANCES_ERROR);

export const setBalances = createAction(
  ACTIONS.SET_BALANCES,
  props<{ balances: Balances }>()
);
