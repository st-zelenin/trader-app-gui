/* eslint-disable @typescript-eslint/member-ordering */
import { createAction, props } from '@ngrx/store';

import { EXCHANGE } from '../../constants';
import { AllAverages, Averages, Balances, CryptoPair, OpenOrdersByPairs, Products, Tickers } from '../../models';

export class ExchangeActions {
  private readonly ACTIONS = {
    GET_ALL_TICKERS: `${this.exchange}[Tickers] get all tickers`,
    GET_ALL_TICKERS_ERROR: `${this.exchange}[Tickers] get all tickers error`,
    SET_ALL_TICKERS: `${this.exchange}[Tickers] set all tickers`,

    GET_ALL_ANALYTICS: `${this.exchange}[Analytics] get all analytics`,
    GET_ALL_ANALYTICS_ERROR: `${this.exchange}[Analytics] get all analytics error`,
    SET_ALL_ANALYTICS: `${this.exchange}[Analytics] set all analytics`,

    GET_ALL_OPEN_ORDERS: `${this.exchange}[Orders] get all open orders`,
    GET_ALL_OPEN_ORDERS_ERROR: `${this.exchange}[Orders] get all open orders error`,
    SET_ALL_OPEN_ORDERS: `${this.exchange}[Orders] set all open orders`,

    GET_BALANCES: `${this.exchange}[Balances] get balances`,
    GET_BALANCES_ERROR: `${this.exchange}[Balances] get balances error`,
    SET_BALANCES: `${this.exchange}[Balances] set balances`,

    GET_CURRENCY_PAIRS: `${this.exchange}[Currency Pairs] get currency pairs`,
    GET_CURRENCY_PAIRS_ERROR: `${this.exchange}[Currency Pairs] get currency pairs error`,
    SET_CURRENCY_PAIRS: `${this.exchange}[Currency Pairs] set currency pairs`,

    SET_PAIRS: `${this.exchange}[Pairs] set pairs`,

    GET_RECENT_BUY_AVERAGES: `${this.exchange}[Recent] get recent buy averages`,
    GET_RECENT_BUY_AVERAGES_ERROR: `${this.exchange}[Recent] get recent buy averages error`,
    SET_RECENT_BUY_AVERAGES: `${this.exchange}[Recent] set recent buy averages`,

    GET_PRODUCTS: `${this.exchange}[Products] get products`,
    GET_PRODUCTS_ERROR: `${this.exchange}[Products] get products error`,
    SET_PRODUCTS: `${this.exchange}[Products] set products`,
  };

  constructor(private readonly exchange: EXCHANGE) {}

  public readonly getTickers = createAction(this.ACTIONS.GET_ALL_TICKERS);

  public readonly getTickersError = createAction(this.ACTIONS.GET_ALL_TICKERS_ERROR);

  public readonly setTickers = createAction(this.ACTIONS.SET_ALL_TICKERS, props<{ tickers: Tickers }>());

  public readonly getAllAnalytics = createAction(this.ACTIONS.GET_ALL_ANALYTICS);

  public readonly getAllAnalyticsError = createAction(this.ACTIONS.GET_ALL_ANALYTICS_ERROR);

  public readonly setAllAnalytics = createAction(this.ACTIONS.SET_ALL_ANALYTICS, props<{ analytics: AllAverages }>());

  public readonly getAllOpenOrders = createAction(this.ACTIONS.GET_ALL_OPEN_ORDERS);

  public readonly getAllOpenOrdersError = createAction(this.ACTIONS.GET_ALL_OPEN_ORDERS_ERROR);

  public readonly setAllOpenOrders = createAction(this.ACTIONS.SET_ALL_OPEN_ORDERS, props<{ openOrders: OpenOrdersByPairs }>());

  public readonly getBalances = createAction(this.ACTIONS.GET_BALANCES);

  public readonly getBalancesError = createAction(this.ACTIONS.GET_BALANCES_ERROR);

  public readonly setBalances = createAction(this.ACTIONS.SET_BALANCES, props<{ balances: Balances }>());

  public readonly getCurrencyPairs = createAction(this.ACTIONS.GET_CURRENCY_PAIRS);

  public readonly getCurrencyPairsError = createAction(this.ACTIONS.GET_CURRENCY_PAIRS_ERROR);

  public readonly setCurrencyPairs = createAction(this.ACTIONS.SET_CURRENCY_PAIRS, props<{ currencyPairs: string[] }>());

  public readonly setPairs = createAction(this.ACTIONS.SET_PAIRS, props<{ pairs: CryptoPair[] }>());

  public readonly getRecentBuyAverages = createAction(this.ACTIONS.GET_RECENT_BUY_AVERAGES);

  public readonly getRecentBuyAveragesError = createAction(this.ACTIONS.GET_RECENT_BUY_AVERAGES_ERROR);

  public readonly setRecentBuyAverages = createAction(this.ACTIONS.SET_RECENT_BUY_AVERAGES, props<{ recentBuyAverages: Averages }>());

  public readonly getProducts = createAction(this.ACTIONS.GET_PRODUCTS);

  public readonly getProductsError = createAction(this.ACTIONS.GET_PRODUCTS_ERROR);

  public readonly setProducts = createAction(this.ACTIONS.SET_PRODUCTS, props<{ products: Products }>());
}
