import { createSelector } from '@ngrx/store';
import { AppState } from '../state';
import { State } from './state';

const selectState = (state: AppState) => state.trading;

export const tickers = createSelector(
  selectState,
  (state: State) => state.tickers
);

export const ticker = (id: string) =>
  createSelector(selectState, (state: State) => state.tickers[id]);

export const averages = createSelector(
  selectState,
  (state: State) => state.analytics
);

export const analytics = (id: string) =>
  createSelector(selectState, (state: State) => state.analytics[id]);

export const pairOpenOrders = (currencyPair: string) =>
  createSelector(selectState, (state: State) => state.openOrders[currencyPair]);

export const currencyBalance = (currency: string) =>
  createSelector(selectState, (state: State) => state.balances[currency]);
