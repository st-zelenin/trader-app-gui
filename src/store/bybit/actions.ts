import { createAction, props } from '@ngrx/store';
import {
  AllAverages,
  Averages,
  Balances,
  OpenOrdersByPairs,
  Tickers,
} from '../../models';
import { ExchangeActions } from '../state';

export enum ACTIONS {
  GET_ALL_TICKERS = '[bybit][Tickers] get all tickers',
  GET_ALL_TICKERS_ERROR = '[bybit][Tickers] get all tickers error',
  SET_ALL_TICKERS = '[bybit][Tickers] set all tickers',

  GET_ALL_ANALYTICS = '[bybit][Analytics] get all analytics',
  GET_ALL_ANALYTICS_ERROR = '[bybit][Analytics] get all analytics error',
  SET_ALL_ANALYTICS = '[bybit][Analytics] set all analytics',

  GET_ALL_OPEN_ORDERS = '[bybit][Orders] get all open orders',
  GET_ALL_OPEN_ORDERS_ERROR = '[bybit][Orders] get all open orders error',
  SET_ALL_OPEN_ORDERS = '[bybit][Orders] set all open orders',

  GET_BALANCES = '[bybit][Balances] get balances',
  GET_BALANCES_ERROR = '[bybit][Balances] get balances error',
  SET_BALANCES = '[bybit][Balances] set balances',

  GET_CURRENCY_PAIRS = '[bybit][Currency Pairs] get currency pairs',
  GET_CURRENCY_PAIRS_ERROR = '[bybit][Currency Pairs] get currency pairs error',
  SET_CURRENCY_PAIRS = '[bybit][Currency Pairs] set currency pairs',

  SET_PAIRS = '[bybit][Pairs] set pairs',

  GET_RECENT_BUY_AVERAGES = '[bybit][Recent] get recent buy averages',
  GET_RECENT_BUY_AVERAGES_ERROR = '[bybit][Recent] get recent buy averages error',
  SET_RECENT_BUY_AVERAGES = '[bybit][Recent] set recent buy averages',
}

const getTickers = createAction(ACTIONS.GET_ALL_TICKERS);

const getTickersError = createAction(ACTIONS.GET_ALL_TICKERS_ERROR);

const setTickers = createAction(
  ACTIONS.SET_ALL_TICKERS,
  props<{ tickers: Tickers }>()
);

const getAllAnalytics = createAction(ACTIONS.GET_ALL_ANALYTICS);

const getAllAnalyticsError = createAction(ACTIONS.GET_ALL_ANALYTICS_ERROR);

const setAllAnalytics = createAction(
  ACTIONS.SET_ALL_ANALYTICS,
  props<{ analytics: AllAverages }>()
);

const getAllOpenOrders = createAction(ACTIONS.GET_ALL_OPEN_ORDERS);

const getAllOpenOrdersError = createAction(ACTIONS.GET_ALL_OPEN_ORDERS_ERROR);

const setAllOpenOrders = createAction(
  ACTIONS.SET_ALL_OPEN_ORDERS,
  props<{ openOrders: OpenOrdersByPairs }>()
);

const getBalances = createAction(ACTIONS.GET_BALANCES);

const getBalancesError = createAction(ACTIONS.GET_BALANCES_ERROR);

const setBalances = createAction(
  ACTIONS.SET_BALANCES,
  props<{ balances: Balances }>()
);

const getCurrencyPairs = createAction(ACTIONS.GET_CURRENCY_PAIRS);

const getCurrencyPairsError = createAction(ACTIONS.GET_CURRENCY_PAIRS_ERROR);

const setCurrencyPairs = createAction(
  ACTIONS.SET_CURRENCY_PAIRS,
  props<{ currencyPairs: string[] }>()
);

const setPairs = createAction(ACTIONS.SET_PAIRS, props<{ pairs: string[] }>());

const getRecentBuyAverages = createAction(ACTIONS.GET_RECENT_BUY_AVERAGES);

const getRecentBuyAveragesError = createAction(
  ACTIONS.GET_RECENT_BUY_AVERAGES_ERROR
);

const setRecentBuyAverages = createAction(
  ACTIONS.SET_RECENT_BUY_AVERAGES,
  props<{ recentBuyAverages: Averages }>()
);

export const actions: ExchangeActions = {
  getTickers,
  getTickersError,
  setTickers,
  getAllAnalytics,
  getAllAnalyticsError,
  setAllAnalytics,
  getAllOpenOrders,
  getAllOpenOrdersError,
  setAllOpenOrders,
  getBalances,
  getBalancesError,
  setBalances,
  getCurrencyPairs,
  getCurrencyPairsError,
  setCurrencyPairs,
  setPairs,
  getRecentBuyAverages,
  getRecentBuyAveragesError,
  setRecentBuyAverages,
};
