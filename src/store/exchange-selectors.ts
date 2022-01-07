import { createSelector } from '@ngrx/store';
import { EXCHANGE } from '../constants';
import { AppState, ExchangeState } from './state';

export class ExchangeSelectors {
  constructor(private readonly exchange: EXCHANGE) {}

  private selectState = (state: AppState) => {
    switch (this.exchange) {
      case EXCHANGE.GATE_IO:
        return state.gate_io;
      case EXCHANGE.CRYPTO_COM:
        return state.crypto_com;
      case EXCHANGE.COINBASE:
        return state.coinbase;
      default:
        throw new Error(`unhandled exchange: ${this.exchange}`);
    }
  };

  public tickers = createSelector(
    this.selectState,
    (state: ExchangeState) => state.tickers
  );

  public ticker = (id: string) =>
    createSelector(
      this.selectState,
      (state: ExchangeState) => state.tickers[id]
    );

  public averages = createSelector(
    this.selectState,
    (state: ExchangeState) => state.analytics
  );

  public analytics = (id: string) =>
    createSelector(
      this.selectState,
      (state: ExchangeState) => state.analytics[id]
    );

  public openOrders = createSelector(
    this.selectState,
    (state) => state.openOrders
  );

  public pairOpenOrders = (currencyPair: string) =>
    createSelector(
      this.selectState,
      (state: ExchangeState) => state.openOrders[currencyPair]
    );

  public currencyPairs = createSelector(
    this.selectState,
    (state) => state.currencyPairs
  );

  public currencyBalance = (currency: string) =>
    createSelector(
      this.selectState,
      (state: ExchangeState) => state.balances[currency]
    );

  public balances = createSelector(
    this.selectState,
    (state: ExchangeState) => state.balances
  );

  public pairs = createSelector(this.selectState, (state) => state.pairs);
}
