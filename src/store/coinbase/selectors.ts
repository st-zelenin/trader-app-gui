import { createSelector } from '@ngrx/store';
import { AppState, ExchangeState } from '../state';

const selectState = (state: AppState) => state.coinbase;

export const tickers = createSelector(
  selectState,
  (state: ExchangeState) => state.tickers
);

export const ticker = (id: string) =>
  createSelector(selectState, (state: ExchangeState) => state.tickers[id]);

export const averages = createSelector(
  selectState,
  (state: ExchangeState) => state.analytics
);

export const analytics = (id: string) =>
  createSelector(selectState, (state: ExchangeState) => state.analytics[id]);

export const openOrders = createSelector(
  selectState,
  (state) => state.openOrders
);

export const pairOpenOrders = (currencyPair: string) =>
  createSelector(
    selectState,
    (state: ExchangeState) => state.openOrders[currencyPair]
  );

export const currencyPairs = createSelector(
  selectState,
  (state) => state.currencyPairs
);

export const currencyBalance = (currency: string) =>
  createSelector(
    selectState,
    (state: ExchangeState) => state.balances[currency]
  );

export const pairs = createSelector(selectState, (state) => state.pairs);
