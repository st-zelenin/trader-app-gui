/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
import { createSelector } from '@ngrx/store';

import { EXCHANGE } from '../../constants';
import { AppState, ExchangeState } from '../models';

export class ExchangeSelectors {
  constructor(private readonly exchange: EXCHANGE) {}

  private readonly selectState = (state: AppState): ExchangeState => {
    switch (this.exchange) {
      case EXCHANGE.GATE_IO:
        return state.gate_io;
      case EXCHANGE.CRYPTO_COM:
        return state.crypto_com;
      case EXCHANGE.COINBASE:
        return state.coinbase;
      case EXCHANGE.BYBIT:
        return state.bybit;
      case EXCHANGE.BINANCE:
        return state.binance;
      default:
        throw new Error(`unhandled exchange: ${this.exchange}`);
    }
  };

  public readonly tickers = createSelector(this.selectState, (state: ExchangeState) => state.tickers);

  public readonly ticker = (id: string) => createSelector(this.selectState, (state: ExchangeState) => state.tickers[id]);

  public readonly averages = createSelector(this.selectState, (state: ExchangeState) => state.analytics);

  public readonly analytics = (id: string) => createSelector(this.selectState, (state: ExchangeState) => state.analytics[id]);

  public readonly openOrders = createSelector(this.selectState, (state) => state.openOrders);

  public readonly pairOpenOrders = (currencyPair: string) =>
    createSelector(this.selectState, (state: ExchangeState) => state.openOrders[currencyPair]);

  public readonly currencyPairs = createSelector(this.selectState, (state) => state.currencyPairs);

  public readonly currencyBalance = (currency: string) =>
    createSelector(this.selectState, (state: ExchangeState) => state.balances[currency]);

  public readonly balances = createSelector(this.selectState, (state: ExchangeState) => state.balances);

  public readonly pairRecentBuyAverages = (currencyPair: string) =>
    createSelector(this.selectState, (state: ExchangeState) => state.recentBuyAverages[currencyPair]);

  public readonly pairs = createSelector(this.selectState, (state) => state.pairs);

  public readonly products = createSelector(this.selectState, (state) => state.products);

  public readonly product = (currencyPair: string) =>
    createSelector(this.selectState, (state: ExchangeState) => (state.products ? state.products[currencyPair] : null));
}
