import { createSelector } from '@ngrx/store';
import { AppState } from '../state';

const selectState = (state: AppState) => state.gate_io;

export const tickers = createSelector(selectState, (state) => state.tickers);

export const ticker = (id: string) =>
  createSelector(selectState, (state) => state.tickers[id]);

export const averages = createSelector(selectState, (state) => state.analytics);

export const analytics = (id: string) =>
  createSelector(selectState, (state) => state.analytics[id]);

export const openOrders = createSelector(
  selectState,
  (state) => state.openOrders
);

export const pairOpenOrders = (currencyPair: string) =>
  createSelector(selectState, (state) => state.openOrders[currencyPair]);

export const currencyPairs = createSelector(
  selectState,
  (state) => state.currencyPairs
);

export const currencyBalance = (currency: string) =>
  createSelector(selectState, (state) => state.balances[currency]);

export const pairs = createSelector(selectState, (state) => state.pairs);
