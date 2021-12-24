import { createSelector } from '@ngrx/store';
import { AppState, ExchangeState } from '../state';

const selectState = (state: AppState) => state.crypto_com;

export const tickers = createSelector(
  selectState,
  (state: ExchangeState) => state.tickers
);

export const ticker = (id: string) =>
  createSelector(selectState, (state: ExchangeState) => state.tickers[id]);

export const analytics = (id: string) =>
  createSelector(selectState, (state) => state.analytics[id]);

export const pairOpenOrders = (currencyPair: string) =>
  createSelector(selectState, (state) => state.openOrders[currencyPair]);

export const currencyBalance = (currency: string) =>
  createSelector(selectState, (state) => state.balances[currency]);
