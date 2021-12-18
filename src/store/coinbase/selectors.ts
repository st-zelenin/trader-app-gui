import { createSelector } from '@ngrx/store';
import { AppState } from '../state';
import { CoinbaseState } from './state';

const selectState = (state: AppState) => state.coinbase;

export const tickers = createSelector(
  selectState,
  (state: CoinbaseState) => state.tickers
);

export const ticker = (id: string) =>
  createSelector(selectState, (state: CoinbaseState) => state.tickers[id]);

export const averages = createSelector(
  selectState,
  (state: CoinbaseState) => state.analytics
);

export const analytics = (id: string) =>
  createSelector(selectState, (state: CoinbaseState) => state.analytics[id]);

export const pairOpenOrders = (currencyPair: string) =>
  createSelector(
    selectState,
    (state: CoinbaseState) => state.openOrders[currencyPair]
  );

export const currencyBalance = (currency: string) =>
  createSelector(
    selectState,
    (state: CoinbaseState) => state.balances[currency]
  );
