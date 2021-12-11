import { createSelector, defaultMemoize } from '@ngrx/store';
import { AppState } from '../state';
import { State } from './state';

const selectState = (state: AppState) => state.trading;

export const tickers = createSelector(
  selectState,
  (state: State) => state.tickers
);

const tickerById = (id: string) =>
  createSelector(selectState, (state: State) => state.tickers[id]);

export const ticker = (id: string) => defaultMemoize(tickerById).memoized(id);

export const averages = createSelector(
  selectState,
  (state: State) => state.analytics
);

const averageById = (id: string) =>
  createSelector(selectState, (state: State) => state.analytics[id]);

export const analytics = (id: string) =>
  defaultMemoize(averageById).memoized(id);

const ordersByCurrencyPair = (currencyPair: string) =>
  createSelector(selectState, (state: State) => state.openOrders[currencyPair]);

export const pairOpenOrders = (currencyPair: string) =>
  defaultMemoize(ordersByCurrencyPair).memoized(currencyPair);

const balanceByCurrency = (currency: string) =>
  createSelector(selectState, (state: State) => state.balances[currency]);

export const currencyBalance = (currency: string) =>
  defaultMemoize(balanceByCurrency).memoized(currency);
